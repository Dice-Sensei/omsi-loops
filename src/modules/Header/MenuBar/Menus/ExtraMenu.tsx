import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';
import { setOption, vals } from '../../../../original/saving.ts';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { borrowTime, returnTime } from '../../../../original/driver.ts';
import { et } from '../../../../locales/translations.utils.ts';
import { CheckboxField } from '../../../../components/forms/CheckboxField.tsx';
import { NumberField } from '../../../../components/forms/NumberField.tsx';
import { HorizontalBar } from '../../../../components/flow/HorizontalBar/HorizontalBar.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';
import { createInterval } from '../../../../signals/createInterval.ts';
import { createStore } from 'solid-js/store';
import { MenuOption } from './MenuOption.tsx';

const t = et('menu.extras');
export const ExtraMenu = () => {
  const [store, setStore] = createStore({
    borrowedTime: 0,
  });

  createInterval(() => {
    setStore({
      borrowedTime: Math.floor(vals.totals.borrowedTime / 86400),
    });
  }, 1000);

  return (
    <MenuOption title={t('title')}>
      <div class='flex flex-col gap-2'>
        <span>{t('description')}</span>
        <HorizontalBar />
        <div class='flex flex-col gap-2'>
          <span class='font-medium'>{t('options.speed.title')}</span>
          <div class='grid grid-cols-[auto_1fr] gap-2'>
            <Tooltip>
              <Tooltip.Trigger>
                <span class='font-medium'>{t('options.speed.bonusMultiplier')}:</span>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <span>{t('options.speed.bonusMultiplierDescription')}</span>
              </Tooltip.Content>
            </Tooltip>
            <NumberField value={5} onChange={(value) => setOption('speedIncreaseCustom', value)} />
            <Tooltip>
              <Tooltip.Trigger>
                <span class='font-medium'>{t('options.speed.backgroundMultiplier')}:</span>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <span>{t('options.speed.backgroundMultiplierDescription')}</span>
              </Tooltip.Content>
            </Tooltip>
            <NumberField value={5} onChange={(value) => setOption('speedIncreaseBackground', value)} />
          </div>
        </div>
        <HorizontalBar />
        <div class='flex items-center gap-2 justify-between'>
          <div class='flex items-center gap-2'>
            <span class='font-medium'>{t('options.bonusTime.title')}:</span>
            <span>{store.borrowedTime}d</span>
          </div>
          <div class='flex gap-2 self-end'>
            <Tooltip>
              <Tooltip.Trigger>
                <Button class='w-28' onClick={borrowTime}>{t('options.bonusTime.borrow')}</Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <span>{t('options.bonusTime.borrowDescription')}</span>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <Button class='w-28' onClick={returnTime}>{t('options.bonusTime.return')}</Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <span>{t('options.bonusTime.returnDescription')}</span>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>
        <HorizontalBar />
        <CheckboxField value={false} onChange={(value) => setOption('fractionalMana', value)}>
          <Tooltip>
            <Tooltip.Trigger>
              <span>{t('options.fractionalMana.title')}</span>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>{t('options.fractionalMana.description')}</span>
            </Tooltip.Content>
          </Tooltip>
        </CheckboxField>
        <HorizontalBar />
        <div class='flex flex-col gap-2'>
          <Tooltip>
            <Tooltip.Trigger>
              <CheckboxField value={false} onChange={(value) => setOption('predictor', value)}>
                <span class='font-medium'>{t('options.predictor.title')}</span>
              </CheckboxField>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>{t('options.predictor.description')}</span>
            </Tooltip.Content>
          </Tooltip>
          <CheckboxField value={false} onChange={(value) => setOption('predictorBackgroundThread', value)}>
            <span>{t('options.predictor.backgroundThread')}</span>
          </CheckboxField>
          <div class='grid grid-cols-[auto_1fr] gap-2'>
            <span>{t('options.predictor.timePrecision')}</span>
            <NumberField value={1} onChange={(value) => setOption('predictorTimePrecision', value)} />
            <span>{t('options.predictor.nextPrecision')}</span>
            <NumberField value={2} onChange={(value) => setOption('predictorNextPrecision', value)} />
          </div>
          <CheckboxField value={false} onChange={(value) => setOption('predictorRepeatPrediction', value)}>
            <span>{t('options.predictor.slowmode')}</span>
          </CheckboxField>
          <div class='flex items-center gap-2'>
            <span>{t('options.predictor.slowTimer')}</span>
            <NumberField class='w-16' value={1} onChange={(value) => setOption('predictorSlowTimer', value)} />
            <span>{t('options.predictor.minutes')}</span>
          </div>
        </div>
      </div>
    </MenuOption>
  );
};
