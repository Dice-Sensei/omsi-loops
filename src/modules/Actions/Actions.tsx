import { Button } from '../../components/buttons/Button/Button.tsx';
import { Icon } from '../../components/buttons/Button/Icon.tsx';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { NumberField } from '../../components/forms/NumberField.tsx';
import { t } from '../../locales/translations.utils.ts';
import { actions } from '../../original/actions.ts';
import { capAllTraining, clearList, loadList, nameList, saveList, selectLoadout } from '../../original/driver.ts';
import { formatNumber } from '../../original/helpers.ts';
import { setOption } from '../../original/saving.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';
import { actionAmount, setActionAmount } from '../../values.ts';
import { formatTime } from '../../views/main.view.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';
import { driverVals } from '../../original/driver.ts';

export const Actions = () => {
  const [values] = createIntervalSignal({
    totalTicks: '0 | 0s',
  }, () => ({
    totalTicks: `${formatNumber(actions.completedTicks)} | ${formatTime(driverVals.timeCounter)}`,
  }));

  return (
    <div>
      <Tooltip>
        <Tooltip.Trigger>
          <div class='font-bold'>Action list</div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <div class='flex gap-2 items-center'>
            <Icon name='circle' class='w-5 h-5' />
            <span>cap to current max</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='plus' class='w-5 h-5' />
            <span>add one loop</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='minus' class='w-5 h-5' />
            <span>remove one loop</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='split' class='w-5 h-5' />
            <span>split action</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='chevronUp' class='w-5 h-5' />
            <span>move action up</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='chevronDown' class='w-5 h-5' />
            <span>move action down</span>
          </div>
          <div class='flex gap-2 items-center'>
            <div class='flex gap-0.5 items-center'>
              <Icon name='circleCheck' class='w-5 h-5' />
              <span>/</span>
              <Icon name='circleClose' class='w-5 h-5' />
            </div>
            <span>enable/disable action</span>
          </div>
          <div class='flex gap-2 items-center'>
            <Icon name='close' class='w-5 h-5' />
            <span>remove action</span>
          </div>
          <span>
            drag and drop the actions to re-arrange them. The next list becomes the current list every restart. One
            second= 50 mana (times your speed multiplier). Minimum 1 tick per action. Restarts automatically upon no
            actions left.
          </span>
        </Tooltip.Content>
      </Tooltip>
      <div>
        <div>
          <div id='curActionsList'></div>
          <Tooltip>
            <Tooltip.Trigger>
              <div class='flex flex-col text-center'>
                <span class='font-medium'>mana used</span>
                <div>{values().totalTicks}</div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Shows stat gain affecting speed.</span>
              <span>Updates every completed action.</span>
              <span>Accurate at the end of the run.</span>
            </Tooltip.Content>
          </Tooltip>
        </div>
        <div>
          <div id='nextActionsList'></div>
          <div id='actionTooltipContainer'>
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
      <div>
        <div>
          <input
            type='checkbox'
            id='keepCurrentListInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('keepCurrentList', checked)}
          >
          </input>
          <label for='keepCurrentListInput'>
            Keep current list active
          </label>
          <input
            type='checkbox'
            id='repeatLastActionInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('repeatLastAction', checked)}
          >
          </input>
          <label for='repeatLastActionInput'>
            Repeat last action on list
          </label>
          <input
            type='checkbox'
            id='addActionsToTopInput'
            class='checkbox'
            onchange={({ target: { checked } }) => setOption('addActionsToTop', checked)}
          >
          </input>
          <label for='addActionsToTopInput'>
            Add action to top
          </label>
        </div>
        <div>
          <Button onClick={() => capAllTraining()}>
            max training
          </Button>
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
                class='loadoutbutton'
                style='margin-bottom: 5px; margin-top: 3px'
                onClick={() => saveList()}
              >
                Save loadout
              </button>
              <button
                class='loadoutbutton'
                style='margin-bottom: 5px'
                onClick={() => loadList()}
              >
                Load loadout
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
        </div>
      </div>
    </div>
  );
};
