import { t } from '../../../../locales/translations.utils.ts';
import { getSaveName, performClearSave, performGameLoad, performSaveGame } from '../../../../original/saving.ts';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { createMemo, createSignal } from 'solid-js';
import cx from 'clsx';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { actions } from '../../../../original/actions.ts';
import { view } from '../../../../views/main.view.ts';
import { vals } from '../../../../original/saving.ts';
import { performGamePause } from '../../../../original/driver.ts';
import { Card } from '../../../../components/containers/Card/Card.tsx';
import { getActionPrototype } from '../../../../original/actionList.ts';
import { readFileContents } from '../../../../utils/readFileContents.ts';

const parseActionListToStr = (actions: any): string => actions.map(({ name, loops }) => `${loops}x ${name}`).join('\n');

const parseActionListFromStr = (str: string): { action: any; name: string; loops: number }[] | undefined => {
  const actions = [];
  for (const line of str.split('\n').filter((s) => s.trim() !== '')) {
    const [loops, name] = line.split('x');
    const action = getActionPrototype(name);
    if (!action) return undefined;

    actions.push({ action, name, loops: +loops });
  }

  return actions;
};

const saveTextFile = (content: string, title: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.txt`;
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
};

const loadSaveState = (saveStr: string) => {
  if (!confirm(t('menu.save.messages.loadWarning'))) return;

  const save = decompressFromBase64(saveStr);
  globalThis.localStorage[getSaveName()] = save;

  performClearSave();
  performGameLoad(null, save);
  performGamePause();
};

export const SaveMenu = () => {
  const [actionlistStr, setActionlistStr] = createSignal<string>('');
  const [saveStr, setSaveStr] = createSignal<string>('');
  const isSaveStrValid = createMemo(() => typeof decompressFromBase64(saveStr()) === 'object');
  const isActionListValid = createMemo(() => !!parseActionListFromStr(actionlistStr()));

  let manageActionlistRef!: HTMLTextAreaElement;
  let manageTextRef!: HTMLInputElement;
  let manageFileRef!: HTMLInputElement;

  const exportActionList = () => {
    setActionlistStr(parseActionListToStr(actions.next));

    manageActionlistRef.select();
    navigator.clipboard.writeText(actionlistStr());
  };

  const importActionList = () => {
    const records = parseActionListFromStr(actionlistStr());
    if (!records) return;

    actions.fromRecords(records);
    view.updateNextActions();
  };

  const importSaveText = () => loadSaveState(saveStr());
  const exportSaveText = () => {
    setSaveStr(compressToBase64(performSaveGame()));

    manageTextRef.select();
    navigator.clipboard.writeText(saveStr());
  };

  const selectSaveFile = () => manageFileRef.click();
  const importSaveFile = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    loadSaveState(await readFileContents(file));
  };
  const exportSaveFile = () => {
    const name = t('game.title');
    const version = t('menu.changelog.versions.0.name');

    const savename = `${name} ${version} - Loop ${vals.totals.loops}`;

    return saveTextFile(compressToBase64(performSaveGame()), savename);
  };

  return (
    <div class='contains-popover'>
      {t('menu.save.title')}
      <div class='popover-content'>
        <Card class='flex flex-col gap-2 z-50'>
          <Button onClick={() => performSaveGame()}>{t('menu.save.actions.saveGame')}</Button>
          <hr class='border-neutral-500'></hr>
          <span class='font-bold'>{t('menu.save.titles.actionlist')}</span>
          <span>{t('menu.save.messages.manageActionlist')}</span>
          <textarea
            ref={manageActionlistRef}
            class='
              w-full min-h-20 max-h-80
              px-2
              border border-neutral-500 hover:border-neutral-700
              rounded-sm
              transition-colors duration-100
            '
            value={actionlistStr()}
            oninput={(e) => setActionlistStr(e.target.value)}
          />
          <div class='grid grid-cols-2 gap-2'>
            <Button onClick={exportActionList}>{t('menu.save.actions.export')}</Button>
            <Button disabled={!isActionListValid()} onClick={importActionList}>{t('menu.save.actions.import')}</Button>
          </div>
          <hr class='border-neutral-500'></hr>
          <span class='font-bold'>{t('menu.save.titles.saveToText')}</span>
          <span>{t('menu.save.messages.manageSaveText')}</span>
          <input
            ref={manageTextRef}
            class='
              px-2
              border border-neutral-500 hover:border-neutral-700
              rounded-sm
              transition-colors duration-100
            '
            value={saveStr()}
            oninput={(e) => setSaveStr(e.target.value)}
          >
          </input>
          <div class='grid grid-cols-2 gap-2'>
            <Button onClick={exportSaveText}>{t('menu.save.actions.export')}</Button>
            <Button disabled={!isSaveStrValid()} onClick={importSaveText}>{t('menu.save.actions.import')}</Button>
          </div>
          <hr class='border-neutral-500'></hr>
          <span class='font-bold'>{t('menu.save.titles.saveToFile')}</span>
          <span>{t('menu.save.messages.manageSaveFile')}</span>
          <div class='grid grid-cols-2 gap-2'>
            <Button onClick={exportSaveFile}>{t('menu.save.actions.export')}</Button>
            <Button onClick={selectSaveFile}>{t('menu.save.actions.import')}</Button>
          </div>
          <input ref={manageFileRef} class='hidden' type='file' onChange={importSaveFile} />
        </Card>
      </div>
    </div>
  );
};
