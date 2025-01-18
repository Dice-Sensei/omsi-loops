import { t } from '../../../../locales/translations.utils.ts';
import { clearSave, load, save } from '../../../../original/saving.ts';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { createEffect, createSignal, ParentProps } from 'solid-js';
import cx from 'clsx';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { actions } from '../../../../original/actions.ts';
import { view } from '../../../../views/main.view.ts';
import { vals } from '../../../../original/saving.ts';
import { pauseGame, restart } from '../../../../original/driver.ts';
import { Card } from '../../../../components/containers/Card/Card.tsx';
import { ClassNameNotFoundError, getActionPrototype } from '../../../../original/actionList.ts';

const parseActionListToStr = (actions: any): string => actions.map(({ name, loops }) => `${loops}x ${name}`).join('\n');

const parseActionListFromStr = (str: string): { action: any; name: string; loops: number }[] | undefined => {
  const actionStrs = str.split('\n');

  const actions = [];
  for (let i = 0; i < actionStrs.length; i++) {
    const [loops, name] = actionStrs[i].split('x');
    const action = getActionPrototype(name);
    if (!action) return undefined;
    actions.push({ action, name, loops: +loops });
  }

  return actions;
};

export const SaveMenu = () => {
  const [actionlistStr, setActionlistStr] = createSignal<string>('');
  let actionlistRef!: HTMLTextAreaElement;

  const handleExportActionList = () => {
    const str = parseActionListToStr(actions.next);
    setActionlistStr(str);

    actionlistRef.select();
    navigator.clipboard.writeText(str);
  };

  const handleImportActionList = () => {
    const actionStrs = parseActionListFromStr(actionlistStr());
    if (!actionStrs) return;

    actions.clearActions();
    for (const { action, name, loops } of actionStrs) {
      if (!action.unlocked()) continue;
      actions.addActionRecord({ name, loops, disabled: false }, -1, false);
    }
    view.updateNextActions();
  };

  const handleExportSave = () => {
    const saveJson = save();

    document.getElementById('exportImport').value = `ILSV01${compressToBase64(saveJson)}`;
    document.getElementById('exportImport').select();

    if (!document.execCommand('copy')) {
      alert('Copying the save to the clipboard failed! You will need to copy the highlighted value yourself.');
    }
  };

  const handleImportSave = () => {
    const saveData = document.getElementById('exportImport').value;
    handleProcessSave(saveData);
  };

  const handleProcessSave = (saveData: string) => {
    if (saveData === '') {
      if (confirm('Importing nothing will delete your save. Are you sure you want to delete your save?')) {
        vals.challengeSave = {};
        clearSave();
      } else {
        return;
      }
    }

    const saveJson = decompressFromBase64(saveData.slice(6));

    if (saveJson) {
      globalThis.localStorage[saveName] = saveJson;
    }
    actions.clearActions();
    actions.current = [];
    load(null, saveJson);
    pauseGame();
    restart();
  };

  const saveFileName = () => {
    const gameName = document.title.replace('*PAUSED* ', '');
    const version = document.querySelector('#changelog > li[data-verNum]').firstChild.textContent.trim();
    return `${gameName} ${version} - Loop ${vals.totals.loops}.txt`;
  };

  const handleExportSaveFile = () => {
    const saveJson = save();
    const saveData = `ILSV01${compressToBase64(saveJson)}`;
    const a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + saveData);
    a.setAttribute('download', saveFileName());
    a.setAttribute('id', 'downloadSave');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenSaveFile = () => {
    document.getElementById('SaveFileInput').click();
  };

  const handleImportSaveFile = (e: Event) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const saveData = e.target.result;
      handleProcessSave(saveData);
    };
    reader.readAsText(file);
  };

  return (
    // <div class='contains-popover'>
    <div class='z-50'>
      {t('menu.save.title')}
      {/* <div class='popover-content'> */}
      <Card class='flex flex-col gap-2 z-50'>
        <Button onClick={() => save()}>{t('menu.save.actions.saveGame')}</Button>
        <hr class='border-neutral-500'></hr>
        <span class='font-bold'>{t('menu.save.titles.actionlist')}</span>
        <span>{t('menu.save.messages.manageActionlist')}</span>
        <textarea
          ref={actionlistRef}
          class='
          w-full min-h-20 max-h-80
          px-2
          border border-neutral-500 hover:border-neutral-700
          rounded-sm
          transition-all duration-100
          '
          id='exportImportList'
          value={actionlistStr()}
        />
        <div class='grid grid-cols-2 gap-2'>
          <Button onClick={handleExportActionList}>{t('menu.save.actions.exportList')}</Button>
          <Button onClick={handleImportActionList}>{t('menu.save.actions.importList')}</Button>
        </div>
        <hr class='border-neutral-500'></hr>
        <span class='font-bold'>{t('menu.save.titles.saveToText')}</span>
        <span>{t('menu.save.messages.manageSaveText')}</span>
        <input class='border' id='exportImport'></input>
        <div class='grid grid-cols-2 gap-2'>
          <Button onClick={handleExportSave}>{t('menu.save.actions.exportSaveToText')}</Button>
          <Button onClick={handleImportSave}>{t('menu.save.actions.importSaveToText')}</Button>
        </div>
        <hr class='border-neutral-500'></hr>
        <span class='font-bold'>{t('menu.save.titles.saveToFile')}</span>
        <span>{t('menu.save.messages.manageSaveFile')}</span>
        <div class='grid grid-cols-2 gap-2'>
          <Button onClick={handleExportSaveFile}>{t('menu.save.actions.exportSaveToFile')}</Button>
          <Button onClick={handleOpenSaveFile}>{t('menu.save.actions.importSaveToFile')}</Button>
        </div>
        <input class='border' id='SaveFileInput' type='file' onChange={handleImportSaveFile} />
      </Card>
    </div>
  );
};

const extendT = (t: typeof t) => {};
