import { t } from '../../../../locales/translations.utils.ts';
import {
  exportCurrentList,
  exportSave,
  exportSaveFile,
  importCurrentList,
  importSave,
  importSaveFile,
  openSaveFile,
  save,
} from '../../../../saving.ts';

export const SaveMenu = () => {
  return (
    <li class='contains-popover'>
      {t('menu.save.title')}
      <div class='popover-content'>
        <button class='button' onClick={() => save()}>Save Manually</button>
        <br></br>
        <textarea id='exportImportList'></textarea>
        <label for='exportImportList'>Export/Import List</label>
        <br></br>
        <button class='button' style='margin-right: 2px;' onClick={() => exportCurrentList()}>
          Export
        </button>
        <button class='button' onClick={() => importCurrentList()}>Import</button>
        <br></br>
        Exports the current list in a plain-text format you can paste and share with others
        <br></br>
        <br></br>
        <input id='exportImport'></input>
        <label for='exportImport'>Export/Import Savefile</label>
        <br></br>
        <button class='button' style='margin-top: 5px; margin-right: 2px;' onClick={() => exportSave()}>
          Export
        </button>
        <button class='button' style='margin-top: 1px;' onClick={() => importSave()}>Import</button>
        <br></br>
        Click Export to export to your clipboard (ctrl-v somewhere else).<br></br>
        Paste a save and click Import to import.<br></br>

        WARNING: Import will break the game if invalid save. Empty import will hard clear the game<br></br>
        If you reaaallly want to edit your save file, <br></br>
        <button
          class='button'
          style='margin-top: 5px; margin-right: 2px;'
          onClick={() => exportSaveFile()}
        >
          Export File
        </button>
        <button class='button' style='margin-top: 1px;' onClick={() => openSaveFile()}>
          Import File
        </button>
        <input
          id='SaveFileInput'
          type='file'
          style='visibility:hidden;'
          onChange={() => importSaveFile(event)}
        >
        </input>
        <br></br>
      </div>
    </li>
  );
};
