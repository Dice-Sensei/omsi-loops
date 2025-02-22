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
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { CheckboxField } from '../../components/forms/CheckboxField.tsx';
import { For, Show } from 'solid-js';
import cx from 'clsx';
import { TextField } from '../../components/forms/TextField.tsx';
import { createSignal } from 'solid-js';

const ActionsOptions = () => {
  return (
    <div class='flex gap-2'>
      <CheckboxField value={false} onChange={(value) => setOption('keepCurrentList', value)}>
        {t('actions.list.options.keepCurrentList')}
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('repeatLastAction', value)}>
        {t('actions.list.options.repeatLastList')}
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('addActionsToTop', value)}>
        {t('actions.list.options.addActionToTop')}
      </CheckboxField>
    </div>
  );
};

const ActionsLoadoutButton = () => {
  const [loadoutName, setLoadoutName] = createSignal('laodout name');

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button>{t('actions.list.loadouts.title')}</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <div>
          <For each={Array.from({ length: 15 }, (_, i) => i + 1)}>
            {(i) => (
              <Button onClick={() => selectLoadout(i)}>
                Loadout {i}
              </Button>
            )}
          </For>
          <button
            onClick={() => saveList()}
          >
            {t('actions.list.loadouts.actions.save')}
          </button>
          <button
            onClick={() => loadList()}
          >
            {t('actions.list.loadouts.actions.load')}
          </button>
          <TextField value={loadoutName()} onChange={setLoadoutName} />
          <Button onClick={() => nameList(true)}>
            {t('actions.list.loadouts.actions.rename')}
          </Button>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

const ActionsTitle = () => (
  <Label
    label={
      <>
        <div class='grid grid-cols-[auto_1fr] gap-2 items-center'>
          <Icon name='circle' class='w-5 h-5' />
          <span>{t('actions.list.actions.cap')}</span>
          <Icon name='plus' class='w-5 h-5' />
          <span>{t('actions.list.actions.add')}</span>
          <Icon name='minus' class='w-5 h-5' />
          <span>{t('actions.list.actions.remove')}</span>
          <Icon name='split' class='w-5 h-5' />
          <span>{t('actions.list.actions.split')}</span>
          <Icon name='chevronUp' class='w-5 h-5' />
          <span>{t('actions.list.actions.moveUp')}</span>
          <Icon name='chevronDown' class='w-5 h-5' />
          <span>{t('actions.list.actions.moveDown')}</span>
          <div class='flex gap-0.5 items-center'>
            <Icon name='circleCheck' class='w-5 h-5' />
            <span>/</span>
            <Icon name='circleClose' class='w-5 h-5' />
          </div>
          <span>{t('actions.list.actions.toggle')}</span>
          <Icon name='close' class='w-5 h-5' />
          <span>{t('actions.list.actions.remove')}</span>
        </div>
        <span>
          {t('actions.list.actions.dragAndDrop')}
        </span>
      </>
    }
    class='font-bold'
  >
    {t('actions.list.name')}
  </Label>
);

const ActionsNextList = (props: { class?: string }) => {
  return <div id='nextActionsList' class={props.class}></div>;
};

const ActionsCurrentList = (props: { class?: string }) => {
  return <div id='curActionsList' class={props.class}></div>;
};

const ActionsCurrentUse = (props: { class?: string }) => {
  const [ticks] = createIntervalSignal(
    '0 | 0s',
    () => `${formatNumber(actions.completedTicks)} | ${formatTime(driverVals.timeCounter)}`,
  );

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div class={cx('flex w-full flex-col text-center', props.class)}>
          <span class='font-medium'>{t('actions.list.current.use.manaUsed')}</span>
          <div>{ticks()}</div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {t('actions.list.current.use.tooltip')}
      </Tooltip.Content>
    </Tooltip>
  );
};

const ActionsNextAmounts = (props: { class?: string }) => {
  return (
    <div class={cx('flex gap-2 items-center', props.class)}>
      <span class='font-bold'>{t('actions.list.amounts.title')}</span>
      <Button class='w-8' onClick={() => setActionAmount(1)}>1</Button>
      <Button class='w-8' onClick={() => setActionAmount(5)}>5</Button>
      <Button class='w-8' onClick={() => setActionAmount(10)}>10</Button>
      <NumberField value={actionAmount()} onChange={setActionAmount} />
    </div>
  );
};

export const Actions = () => (
  <div class='flex flex-col gap-2'>
    <ActionsTitle />
    <div class='grid grid-cols-6 divide-x divide-emerald-800'>
      <div class='col-span-1 bg-emerald-500 py-4'>
        <ActionsCurrentList />
        <ActionsCurrentUse class='px-4 justify-center' />
      </div>
      <div class='col-span-5 bg-emerald-700 py-4'>
        <ActionsNextList />
        <ActionsNextAmounts class='px-4 justify-center' />
      </div>
    </div>
    <div class='grid grid-cols-2 gap-2'>
      <ActionsOptions />
      <div class='flex gap-2'>
        <Button class='w-full' onClick={() => capAllTraining()}>
          {t('actions.list.actions.maxTraining')}
        </Button>
        <Show when={!KeyboardKey.shift()}>
          <Button class='w-full' onClick={() => clearList()}>
            {t('actionList.actions.clearAll')}
          </Button>
        </Show>
        <Show when={KeyboardKey.shift()}>
          <Button class='w-full' onClick={() => clearList()}>
            {t('actionList.actions.clearDisabled')}
          </Button>
        </Show>
        <ActionsLoadoutButton />
      </div>
    </div>
  </div>
);
