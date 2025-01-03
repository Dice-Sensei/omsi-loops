importScripts('./data.ts');
importScripts('./Localization.ts');
importScripts('./helpers.ts');
importScripts('./actionList.ts');
importScripts('./driver.ts');
importScripts('./stats.js');
importScripts('./actions.ts');
importScripts('./town.ts');
importScripts('./prestige.ts');
importScripts('./globals.ts');
importScripts('./saving.ts');
importScripts('./predictor.ts');

// to moduleify
// - stats.js
// - actions.js
// - saving.js

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

let queuedUpdate;

onmessage = (e) => {
  const { data } = e;
  // console.log("Got message:", data);
  handleMessage(data);
};

function handleMessage(data) {
  const postMessage = self.postMessage;

  if (!data?.type) {
    console.error('Unexpected message, no type:', data);
    return;
  }

  switch (data.type) {
    // case "loadSave":
    //     console.log("loading save");
    //     doLoad(data.save);
    //     console.log("loaded save");
    //     break;
    case 'setOptions':
      predictor.setOptions(data.options);
      // console.debug("set options");
      break;
    case 'verifyDefaultIds':
      if (!globalThis.Data.verifyDefaultIds(data.idRefs)) {
        postMessage({ type: 'error', message: 'default id verification failed' });
      }
      // console.debug("default ids verified");
      break;
    case 'importSnapshots':
      if (data.resetToDefaults) {
        // when the main thread has reason to believe that none of the cached snapshots will be useful
        // anymore, it will send resetToDefaults to clear Data.snapshotStack.
        globalThis.Data.resetToDefaults();
      }
      const { snapshotExports } = data;
      let loadCount = 0;
      try {
        for (const exportToLoad of snapshotExports) {
          if (globalThis.Data.getSnapshotIndex({ id: exportToLoad.id }) >= 0) {
            // already loaded, skip
            console.debug(`Already loaded snapshot ${exportToLoad.id}`);
            continue;
          }
          // console.debug(`importing snapshot ${exportToLoad.id}`);
          globalThis.Data.importSnapshot(exportToLoad);
          loadCount++;
        }
      } catch (e) {
        if (e instanceof globalThis.SnapshotMissingError) {
          console.error(`missing snapshot ${e.id}?`, e);
          postMessage({ type: 'error', message: e.message });
        } else {
          postMessage({ type: 'error', message: e.toString() });
        }
        return;
      }
      // console.debug(`imported ${loadCount} snapshots of ${snapshotExports.length} provided`, snapshotExports);
      if (queuedUpdate) {
        // succeeded, go back into startUpdate
        const qu = queuedUpdate;
        queuedUpdate = undefined;
        handleMessage(qu);
      }
      break;
    case 'startUpdate':
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
