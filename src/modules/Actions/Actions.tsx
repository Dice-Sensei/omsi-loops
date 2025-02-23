import { Button } from '../../components/buttons/Button/Button.tsx';
import { Icon } from '../../components/buttons/Button/Icon.tsx';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { NumberField } from '../../components/forms/NumberField.tsx';
import { t } from '../../locales/translations.utils.ts';
import { actions } from '../../original/actions.ts';
import { capAllTraining, clearList, loadList, nameList, saveList, selectLoadout } from '../../original/driver.ts';
import { formatNumber } from '../../original/helpers.ts';
import { setOption } from '../../original/saving.ts';
import { createIntervalAccessor } from '../../signals/createInterval.ts';
import { actionAmount, setActionAmount } from '../../values.ts';
import { formatTime } from '../../views/main.view.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';
import { driverVals } from '../../original/driver.ts';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { CheckboxField } from '../../components/forms/CheckboxField.tsx';
import { Show } from 'solid-js';
import cx from 'clsx';
import { TextField } from '../../components/forms/TextField.tsx';
import { createMemo, createSignal } from 'solid-js';
import { For } from '../../components/flow/For/For.tsx';

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
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null);
  const list = createIntervalAccessor([], () => actions.current);

  const hoveredAction = createMemo(() => {
    const index = hoveredIndex();

    if (index === null) return null;

    return list()[index];
  });

  return (
    <Tooltip placement='right-start'>
      <Tooltip.Trigger>
        <For each={list()} as='div' class='flex flex-col divide-y divide-emerald-900 w-full'>
          {(action, index) => {
            const values = createIntervalAccessor({
              isProgress: false,
              isFailed: false,
              isDone: false,
              percentage: 0,
              status: 'failed',
            }, () => {
              const isFailed = !!action.errorMessage;
              const isDone = !isFailed && action.loopsLeft === 0;
              const isProgress = !isFailed && !isDone;

              const status = isFailed ? 'failed' : isDone ? 'done' : 'progress';
              const percentage = isProgress ? action.ticks / action.adjustedTicks * 100 : 100;

              return { status, isFailed, isDone, isProgress, percentage };
            });

            return (
              <Tooltip>
                <Tooltip.Trigger>
                  <div
                    onMouseEnter={() => setHoveredIndex(index())}
                    onMouseLeave={() => setHoveredIndex(null)}
                    class='relative flex gap-1 items-center text-sm divide-x divide-emerald-700 hover:bg-emerald-800 w-full transition-colors duration-50'
                  >
                    <div
                      class={cx(
                        'absolute inset-0',
                        values().status === 'failed' && 'bg-red-500/50',
                        values().status === 'done' && 'bg-blue-500/50',
                        values().status === 'progress' && 'bg-emerald-900/50',
                      )}
                      style={{ width: `${values().percentage}%` }}
                    />
                    <img src={`icons/${action.imageName}.svg`} class='w-4 h-4' />
                    <div class='flex gap-0.5 items-center px-2'>
                      <span>{action.loops - action.loopsLeft}</span>
                      <span>/</span>
                      <span>{action.loops}</span>
                    </div>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <div class='font-bold'>{action.name}</div>
                  <div class='grid grid-cols-[auto,1fr] gap-x-1'>
                    <div class='font-medium'>Actions left:</div>
                    <div>{action.loopsLeft}</div>
                    <div class='font-medium'>Actions total:</div>
                    <div>{action.loops}</div>
                    <div class='font-medium'>Actions percentage:</div>
                    <div>{values().percentage}%</div>
                  </div>
                </Tooltip.Content>
              </Tooltip>
            );
          }}
        </For>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Show when={hoveredAction()}>
          <div class='flex flex-col gap-1'>
            <div class='font-bold w-full text-center'>
              {hoveredAction()?.name}
            </div>
            <div class='grid grid-cols-[auto,1fr] gap-x-1'>
              <div class='font-medium'>Mana original:</div>
              <div>{hoveredAction()?.manaCost() * hoveredAction()?.loops}</div>
              <div class='font-medium'>Mana used:</div>
              <div>{hoveredAction()?.manaUsed}</div>
              <div class='font-medium'>Mana last:</div>
              <div>{hoveredAction()?.lastMana}</div>
              <div class='font-medium'>Mana remaining:</div>
              <div>{hoveredAction()?.manaRemaining}</div>
              <div class='font-medium'>Gold remaining:</div>
              <div>{hoveredAction()?.goldRemaining}</div>
              <div class='font-medium'>Time spent:</div>
              <div>{hoveredAction()?.timeSpent}</div>
              <div class='font-medium'>Time in loop:</div>
              <div>{hoveredAction()?.effectiveTimeElapsed}</div>
            </div>
            <div class='font-medium'>Experience gain:</div>
            <For
              each={Object.entries(hoveredAction()?.exp ?? {})}
              as='div'
              class='grid grid-cols-[auto,1fr,auto,1fr] gap-x-1 text-sm'
            >
              {([stat, exp]) => (
                <>
                  <div class='font-medium'>{stat}:</div>
                  <div>{exp}</div>
                </>
              )}
            </For>
          </div>
        </Show>
      </Tooltip.Content>
    </Tooltip>
  );
};

const ActionsCurrentUse = (props: { class?: string }) => {
  const ticks = createIntervalAccessor(
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
