import { Button } from '../../components/buttons/Button/Button.tsx';
import { NumberField } from '../../components/forms/NumberField.tsx';
import { t } from '../../locales/translations.utils.ts';
import { capAllTraining, clearList, loadList, nameList, saveList, selectLoadout } from '../../original/driver.ts';
import { setOption } from '../../original/saving.ts';
import { actionAmount, setActionAmount } from '../../values.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';

export const Actions = () => {
  return (
    <div id='actionList' style='width: 100%; text-align: center'>
      <div class='showthat'>
        <div class='large bold localized' style='margin-right: -49px' data-locale='actions>title_list'></div>
        <span id='predictorTotalDisplay' class='koviko'></span>
        <span id='predictorStatisticDisplay' class='koviko'></span>
        <div class='showthis'>
          <i class='actionIcon far fa-circle'></i>
          <span class='localized' data-locale='actions>tooltip>icons>circle'></span>
          <i class='actionIcon fas fa-plus'></i>
          <span class='localized' data-locale='actions>tooltip>icons>plus'></span>
          <i class='actionIcon fas fa-minus'></i>
          <span class='localized' data-locale='actions>tooltip>icons>minus'></span>
          <i class='actionIcon fas fa-arrows-alt-h'></i>
          <span class='localized' data-locale='actions>tooltip>icons>arrows_h'></span>
          <i class='actionIcon fas fa-sort-up'></i>
          <span class='localized' data-locale='actions>tooltip>icons>sort_up'></span>
          <i class='actionIcon fas fa-sort-down'></i>
          <span class='localized' data-locale='actions>tooltip>icons>sort_down'></span>
          <i class='actionIcon far fa-check-circle'></i>
          <span style='margin-left: -2px'>/</span>
          <i class='actionIcon far fa-times-circle'></i>
          <span class='localized' data-locale='actions>tooltip>icons>circles'></span>
          <i class='actionIcon fas fa-times'></i>
          <span class='localized' data-locale='actions>tooltip>icons>times'></span>
          <span class='localized' data-locale='actions>tooltip>list_explanation'></span>
        </div>
      </div>
      <div id='expandableList'>
        <div id='curActionsListContainer'>
          <div id='curActionsList'></div>
          <div id='curActionsManaUsed' class='showthat'>
            <div class='bold localized' data-locale='actions>tooltip>mana_used'></div>
            <div id='totalTicks' style='font-size: 0.75rem'></div>
            <div class='showthis localized' data-locale='actions>tooltip>mana_used_explanation'></div>
          </div>
        </div>
        <div id='nextActionsListContainer'>
          <div id='nextActionsList'></div>
          <div
            id='actionTooltipContainer'
            style='margin-top: 10px; width: 100%; text-align: left; max-height: 357px; overflow: auto'
          >
          </div>
          <div class='flex gap-2 items-center'>
            <span class='font-bold'>{t('actions.amounts.title')}</span>
            <Button class='w-8' onClick={() => setActionAmount(1)}>1</Button>
            <Button class='w-8' onClick={() => setActionAmount(5)}>5</Button>
            <Button class='w-8' onClick={() => setActionAmount(10)}>10</Button>
            <NumberField id='actionAmount' value={actionAmount()} onChange={setActionAmount} />
          </div>
        </div>
      </div>
      <div id='actionChanges' style='display: flex; text-align: left; width: 100%; margin-top: 5px'>
        <div id='actionChangeOptions' style='width: 50%'>
          <input
            type='checkbox'
            id='keepCurrentListInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('keepCurrentList', checked)}
          >
          </input>
          <label
            for='keepCurrentListInput'
            class='localized'
            data-locale='actions>tooltip>current_list_active'
          >
          </label>
          <input
            type='checkbox'
            id='repeatLastActionInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('repeatLastAction', checked)}
          >
          </input>
          <label
            for='repeatLastActionInput'
            class='localized'
            data-locale='actions>tooltip>repeat_last_action'
          >
          </label>
          <input
            type='checkbox'
            id='addActionsToTopInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('addActionsToTop', checked)}
          >
          </input>
          <label for='addActionsToTopInput' class='localized' data-locale='actions>tooltip>add_action_top'></label>
        </div>
        <div id='actionChangeButtons' style='margin-left: -4px; text-align: right; width: 50%'>
          <button
            id='maxTraining'
            class='button localized'
            style='margin-right: 0px; display: none'
            onClick={() => capAllTraining()}
            data-locale='actions>tooltip>max_training'
          >
          </button>
          <Button onClick={() => clearList()}>
            {KeyboardKey.shift() ? t('actionList.actions.clearAll') : t('actionList.actions.clearDisabled')}
          </Button>
          <div tabindex='0' class='showthatloadout'>
            Manage Loadouts
            <div class='showthisloadout'>
              <button
                class='loadoutbutton unused'
                id='load1'
                onClick={() => selectLoadout(1)}
                style='width: 200px'
              >
                Loadout 1
              </button>
              <button
                class='loadoutbutton unused'
                id='load2'
                onClick={() => selectLoadout(2)}
                style='width: 200px'
              >
                Loadout 2
              </button>
              <button
                class='loadoutbutton unused'
                id='load3'
                onClick={() => selectLoadout(3)}
                style='width: 200px'
              >
                Loadout 3
              </button>
              <button
                class='loadoutbutton unused'
                id='load4'
                onClick={() => selectLoadout(4)}
                style='width: 200px'
              >
                Loadout 4
              </button>
              <button
                class='loadoutbutton unused'
                id='load5'
                onClick={() => selectLoadout(5)}
                style='width: 200px'
              >
                Loadout 5
              </button>
              <button
                class='loadoutbutton unused'
                id='load6'
                onClick={() => selectLoadout(6)}
                style='width: 200px'
              >
                Loadout 6
              </button>
              <button
                class='loadoutbutton unused'
                id='load7'
                onClick={() => selectLoadout(7)}
                style='width: 200px'
              >
                Loadout 7
              </button>
              <button
                class='loadoutbutton unused'
                id='load8'
                onClick={() => selectLoadout(8)}
                style='width: 200px'
              >
                Loadout 8
              </button>
              <button
                class='loadoutbutton unused'
                id='load9'
                onClick={() => selectLoadout(9)}
                style='width: 200px'
              >
                Loadout 9
              </button>
              <button
                class='loadoutbutton unused'
                id='load10'
                onClick={() => selectLoadout(10)}
                style='width: 200px'
              >
                Loadout 10
              </button>
              <button
                class='loadoutbutton unused'
                id='load11'
                onClick={() => selectLoadout(11)}
                style='width: 200px'
              >
                Loadout 11
              </button>
              <button
                class='loadoutbutton unused'
                id='load12'
                onClick={() => selectLoadout(12)}
                style='width: 200px'
              >
                Loadout 12
              </button>
              <button
                class='loadoutbutton unused'
                id='load13'
                onClick={() => selectLoadout(13)}
                style='width: 200px'
              >
                Loadout 13
              </button>
              <button
                class='loadoutbutton unused'
                id='load14'
                onClick={() => selectLoadout(14)}
                style='width: 200px'
              >
                Loadout 14
              </button>
              <button
                class='loadoutbutton unused'
                id='load15'
                onClick={() => selectLoadout(15)}
                style='width: 200px'
              >
                Loadout 15
              </button>
              <button
                class='loadoutbutton localized'
                style='margin-bottom: 5px; margin-top: 3px'
                onClick={() => saveList()}
                data-locale='actions>tooltip>save_loadout'
              >
              </button>
              <button
                class='loadoutbutton localized'
                style='margin-bottom: 5px'
                onClick={() => loadList()}
                data-locale='actions>tooltip>load_loadout'
              >
              </button>
              <input
                id='renameLoadout'
                value='Loadout Name'
                style='width: 100px; height: 16px; border: 1px solid var(--input-border); margin-left: 5px; margin-bottom: 2px'
              >
              </input>
              <button
                class='loadoutbutton'
                style='margin-bottom: 5px; margin-top: 3px; margin-right: -4px'
                onClick={() => nameList(true)}
              >
                Rename
              </button>
            </div>
          </div>
          <select
            id='predictorTrackedStatInput'
            class='button'
            onchange={({ target: { value } }) => setOption('predictorTrackedStat', value)}
          />
        </div>
      </div>
    </div>
  );
};
