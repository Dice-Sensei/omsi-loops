import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';
import { Icon } from '../../../../components/buttons/Button/Icon.tsx';
import { createStore } from 'solid-js/store';
import { createInterval } from '../../../../signals/createInterval.ts';
import {
  getPrestigeCost,
  getPrestigeCurrentBonus,
  prestigeUpgrade,
  prestigeValues,
  resetAllPrestiges,
} from '../../../../original/prestige.ts';
import { et } from '../../../../locales/translations.utils.ts';
import { HorizontalBar } from '../../../../components/flow/HorizontalBar/HorizontalBar.tsx';

const t = et('menu.prestige');
export const PrestigeMenu = () => {
  const [store, setStore] = createStore({
    prestigeCurrentPoints: 0,
    prestigeTotalPoints: 0,
    prestigeTotalCompletions: 0,
    completedCurrentPrestige: false,
    completedAnyPrestige: false,
    prestigePhysicalCurrentBonus: 0,
    prestigeMentalCurrentBonus: 0,
    prestigeCombatCurrentBonus: 0,
    prestigeSpatiomancyCurrentBonus: 0,
    prestigeChronomancyCurrentBonus: 0,
    prestigeBarteringCurrentBonus: 0,
    prestigeExpOverflowCurrentBonus: 0,
    prestigePhysicalNextCost: 0,
    prestigeMentalNextCost: 0,
    prestigeCombatNextCost: 0,
    prestigeSpatiomancyNextCost: 0,
    prestigeChronomancyNextCost: 0,
    prestigeBarteringNextCost: 0,
    prestigeExpOverflowNextCost: 0,
  });

  createInterval(() => {
    setStore({
      prestigeCurrentPoints: prestigeValues.prestigeCurrentPoints,
      prestigeTotalPoints: prestigeValues.prestigeTotalPoints,
      prestigeTotalCompletions: prestigeValues.prestigeTotalCompletions,
      completedCurrentPrestige: prestigeValues.completedCurrentPrestige,
      completedAnyPrestige: prestigeValues.completedAnyPrestige,
      prestigePhysicalCurrentBonus: getPrestigeCurrentBonus('PrestigePhysical'),
      prestigeMentalCurrentBonus: getPrestigeCurrentBonus('PrestigeMental'),
      prestigeCombatCurrentBonus: getPrestigeCurrentBonus('PrestigeCombat'),
      prestigeSpatiomancyCurrentBonus: getPrestigeCurrentBonus('PrestigeSpatiomancy'),
      prestigeChronomancyCurrentBonus: getPrestigeCurrentBonus('PrestigeChronomancy'),
      prestigeBarteringCurrentBonus: getPrestigeCurrentBonus('PrestigeBartering'),
      prestigeExpOverflowCurrentBonus: getPrestigeCurrentBonus('PrestigeExpOverflow'),
      prestigePhysicalNextCost: getPrestigeCost('PrestigePhysical'),
      prestigeMentalNextCost: getPrestigeCost('PrestigeMental'),
      prestigeCombatNextCost: getPrestigeCost('PrestigeCombat'),
      prestigeSpatiomancyNextCost: getPrestigeCost('PrestigeSpatiomancy'),
      prestigeChronomancyNextCost: getPrestigeCost('PrestigeChronomancy'),
      prestigeBarteringNextCost: getPrestigeCost('PrestigeBartering'),
      prestigeExpOverflowNextCost: getPrestigeCost('PrestigeExpOverflow'),
    });
  }, 1000);

  return (
    <Popover>
      <Popover.Trigger>
        <Button variant='text'>{t('title')}</Button>
      </Popover.Trigger>
      <Popover.Content class='max-w-[400px]'>
        <div class='flex flex-col gap-2'>
          <div>
            <span>{t('descriptions.active')}</span>
          </div>
          <div>
            <span class='font-medium'>{t('descriptions.spec')}</span>
          </div>
          <div>
            <span>{t('descriptions.carryover')}</span>
          </div>
          <div class='grid grid-cols-[auto_1fr] gap-2'>
            <div class='font-medium'>{t('descriptions.maxCarryover')}:</div>
            <div>{store.prestigeTotalCompletions}</div>
            <div class='font-medium'>{t('descriptions.totalPrestigesCompleted')}:</div>
            <div>{store.prestigeTotalCompletions}</div>
            <div class='font-medium'>{t('descriptions.availablePoints')}:</div>
            <div class='inline-flex gap-1 items-center'>
              <span>{store.prestigeCurrentPoints}</span>
              <span>/</span>
              <span>{store.prestigeTotalPoints}</span>
            </div>
          </div>
          <div>
            <span class='font-medium'>{t('descriptions.upgradeCost')}:</span>
            <div class='text-sm flex gap-1 items-center'>
              <span>cost(1) = 30</span>
              <span>;</span>
              <span>cost(n) = cost(n - 1) + 5n</span>
            </div>
            <div class='text-sm flex gap-1 items-center'>
              <span>30</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>40</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>55</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>75</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>100</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>130</span>
              <Icon class='w-4 h-4' name='arrowRight' />
              <span>...</span>
            </div>
          </div>
          <HorizontalBar />
          <div class='grid grid-cols-1 gap-2'>
            <PrestigeOption
              title={t('actions.improvePhysical.title')}
              description={t('actions.improvePhysical.description')}
              currentBonus={store.prestigePhysicalCurrentBonus}
              nextLevelCost={store.prestigePhysicalNextCost}
              action={() => prestigeUpgrade('PrestigePhysical')}
            />
            <PrestigeOption
              title={t('actions.improveMental.title')}
              description={t('actions.improveMental.description')}
              currentBonus={store.prestigeMentalCurrentBonus}
              nextLevelCost={store.prestigeMentalNextCost}
              action={() => prestigeUpgrade('PrestigeMental')}
            />
            <PrestigeOption
              title={t('actions.improveCombat.title')}
              description={t('actions.improveCombat.description')}
              currentBonus={store.prestigeCombatCurrentBonus}
              nextLevelCost={store.prestigeCombatNextCost}
              action={() => prestigeUpgrade('PrestigeCombat')}
            />
            <PrestigeOption
              title={t('actions.improveSpatiomancy.title')}
              description={t('actions.improveSpatiomancy.description')}
              currentBonus={store.prestigeSpatiomancyCurrentBonus}
              nextLevelCost={store.prestigeSpatiomancyNextCost}
              action={() => prestigeUpgrade('PrestigeSpatiomancy')}
            />
            <PrestigeOption
              title={t('actions.improveChronomancy.title')}
              description={t('actions.improveChronomancy.description')}
              currentBonus={store.prestigeChronomancyCurrentBonus}
              nextLevelCost={store.prestigeChronomancyNextCost}
              action={() => prestigeUpgrade('PrestigeChronomancy')}
            />
            <PrestigeOption
              title={t('actions.improveBartering.title')}
              description={t('actions.improveBartering.description')}
              currentBonus={store.prestigeBarteringCurrentBonus}
              nextLevelCost={store.prestigeBarteringNextCost}
              action={() => prestigeUpgrade('PrestigeBartering')}
            />
            <PrestigeOption
              title={t('actions.improveExpOverflow.title')}
              description={t('actions.improveExpOverflow.description')}
              currentBonus={store.prestigeExpOverflowCurrentBonus}
              nextLevelCost={store.prestigeExpOverflowNextCost}
              action={() => prestigeUpgrade('PrestigeExpOverflow')}
            />
            <HorizontalBar />
            <PrestigeReset />
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
};

interface PrestigeOptionProps {
  title: string;
  description: string;
  currentBonus: number;
  nextLevelCost: number;
  action: () => void;
}

const PrestigeOption = (props: PrestigeOptionProps) => (
  <Tooltip placement='right'>
    <Tooltip.Trigger>
      <Button class='w-full' onClick={props.action}>
        {props.title}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <div>{props.description}</div>
      <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
        <span class='font-medium'>{t('descriptions.currentBonus')}:</span>
        <span>{props.currentBonus}%</span>
        <span class='font-medium'>{t('descriptions.nextLevelCost')}:</span>
        <span>{props.nextLevelCost} {t('descriptions.points')}</span>
      </div>
    </Tooltip.Content>
  </Tooltip>
);

const PrestigeReset = () => (
  <Tooltip placement='right'>
    <Tooltip.Trigger>
      <Button class='w-full' onClick={() => resetAllPrestiges()}>
        {t('actions.reset.title')}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <div>{t('actions.reset.description')}</div>
    </Tooltip.Content>
  </Tooltip>
);
