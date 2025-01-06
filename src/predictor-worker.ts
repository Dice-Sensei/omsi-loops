import { Data, SnapshotMissingError } from './data.ts';
import './localization.ts';
import './helpers.ts';
import './actionList.ts';
import './driver.ts';
import './stats.ts';
import './actions.ts';
import './town.ts';
import './prestige.ts';
import './globals.ts';
import './saving.ts';
import './predictor.ts';

/**
 * @typedef {{
 *  type: "setOptions",
 *  options: typeof options,
 * } | {
 *  type: "verifyDefaultIds",
 *  idRefs: SnapshotIdMap,
 * } | {
 *  type: "importSnapshots",
 *  snapshotExports: SnapshotExport[],
 *  resetToDefaults?: boolean,
 * } | {
 *  type: "startUpdate",
 *  runData: PredictorRunData,
 *  snapshotHeritage: number[],
 * }} MessageToPredictor
 *
 * @typedef {{
 *  type: "error",
 *  message: string,
 * } | {
 *  type: "getSnapshots",
 *  snapshotIds: number[],
 * } | {
 *  type: "update",
 *  id: number,
 *  i: number,
 *  state: PredictorRunState,
 *  isValid: boolean,
 * } | {
 *  type: "endUpdate",
 *  id: number,
 *  runData: PredictorRunData,
 * }} MessageFromPredictor
 */

console.log('starting predictor worker');

globalThis.saving.loadDefaults();

const predictor = globalThis.Koviko.initWorkerPredictor();

let queuedUpdate: MessageToPredictor | undefined;

onmessage = ({ data }) => handleMessage(data);

function handleMessage(data) {
  const postMessage = self.postMessage;

  if (!data?.type) {
    console.error('Unexpected message, no type:', data);
    return;
  }

  switch (data.type) {
    case 'setOptions':
      predictor.setOptions(data.options);
      break;
    case 'verifyDefaultIds':
      if (!globalThis.Data.verifyDefaultIds(data.idRefs)) {
        postMessage({ type: 'error', message: 'default id verification failed' });
      }
      break;
    case 'importSnapshots': {
      if (data.resetToDefaults) {
        globalThis.Data.resetToDefaults();
      }
      const { snapshotExports } = data;
      let loadCount = 0;
      try {
        for (const exportToLoad of snapshotExports) {
          if (globalThis.Data.getSnapshotIndex({ id: exportToLoad.id }) >= 0) {
            console.debug(`Already loaded snapshot ${exportToLoad.id}`);
            continue;
          }
          globalThis.Data.importSnapshot(exportToLoad);
          loadCount++;
        }
      } catch (e) {
        if (e instanceof SnapshotMissingError) {
          console.error(`missing snapshot ${e.id}?`, e);
          postMessage({ type: 'error', message: e.message });
        } else {
          postMessage({ type: 'error', message: e.toString() });
        }
        return;
      }
      if (queuedUpdate) {
        const qu = queuedUpdate;
        queuedUpdate = undefined;
        handleMessage(qu);
      }
      break;
    }
    case 'startUpdate': {
      const { runData, snapshotHeritage } = data;
      const id = snapshotHeritage.at(-1);
      if (globalThis.Data.getSnapshotIndex({ id }) >= 0) {
        // console.debug(`Loading snapshot ${id}`);
        globalThis.Data.getSnapshot({ id }).applyState();
        predictor.workerUpdate(runData);
        // console.debug("started update");
      } else {
        const requiredSnapshots = snapshotHeritage.filter((id) => globalThis.Data.getSnapshotIndex({ id }) === -1);
        // console.debug(`Requesting ${requiredSnapshots.length} snapshots for heritage of length ${snapshotHeritage.length}: ${requiredSnapshots.join(", ")}`, snapshotHeritage);
        queuedUpdate = data;
        postMessage({ type: 'getSnapshots', snapshotIds: requiredSnapshots });
      }
      break;
    }
  }
}
