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
      <Popover.Target>
        <Button variant='text'>Prestige Perks</Button>
      </Popover.Target>
      <Popover.Content class='max-w-[400px]'>
        <div class='flex flex-col gap-2'>
          <div>
            <span>
              Prestige bonuses are always active. Each time you complete the game, you receive 90 points to spend on
              these bonuses. Please export and save your data locally before attempting to trigger a prestige.
            </span>
          </div>
          <div>
            <span class='font-medium'>
              The ability to spec into prestige bonuses may be done at any time, but keep in mind this will reset ALL
              progress.
            </span>
          </div>
          <div>
            <span>
              Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've
              completed.
            </span>
          </div>
          <div class='grid grid-cols-[auto_1fr] gap-2'>
            <div class='font-medium'>Max carryover possible:</div>
            <div>{store.prestigeTotalCompletions}</div>
            <div class='font-medium'>Total Prestiges Completed:</div>
            <div>{store.prestigeTotalCompletions}</div>
            <div class='font-medium'>Available points:</div>
            <div class='inline-flex gap-1 items-center'>
              <span>{store.prestigeCurrentPoints}</span>
              <span>/</span>
              <span>{store.prestigeTotalPoints}</span>
            </div>
          </div>
          <div>
            <span class='font-medium'>Upgrade cost follows the format of:</span>
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
          <div class='grid grid-cols-1 gap-2'>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigePhysical')}>
                  Prestige Physical
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigePhysicalCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigePhysicalNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeMental')}>
                  Prestige Mental
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeMentalCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeMentalNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeCombat')}>
                  Prestige Combat
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases Self and Team Combat by 20% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeCombatCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeCombatNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeSpatiomancy')}>
                  Prestige Spatiomancy
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases the number of "Findables" per zone by 10% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeSpatiomancyCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeSpatiomancyNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeChronomancy')}>
                  Prestige Chronomancy
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases speed of all zones by a multiplier of 5% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeChronomancyCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeChronomancyNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeBartering')}>
                  Prestige Bartering
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Increases mana received from merchants by 10% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeBarteringCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeBarteringNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => prestigeUpgrade('PrestigeExpOverflow')}>
                  Prestige Experience Overflow
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Experience earned is spread amongst all stats by 2% per level.
                </div>
                <div class='grid grid-cols-[auto_1fr] gap-0.5 items-center'>
                  <span class='font-medium'>Current Bonus:</span>
                  <span>{store.prestigeExpOverflowCurrentBonus}%</span>
                  <span class='font-medium'>Next level cost:</span>
                  <span>{store.prestigeExpOverflowNextCost} points</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip placement='right'>
              <Tooltip.Target>
                <Button class='w-full' onClick={() => resetAllPrestiges()}>
                  Reset All Prestiges
                </Button>
              </Tooltip.Target>
              <Tooltip.Content>
                <div>
                  Resets all current prestige bonuses, giving you back the points to allocate again. Note, this DOES
                  trigger a reset, so this cannot be done mid-playthrough.
                </div>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
};
