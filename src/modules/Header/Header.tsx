import { createMemo, createSignal, ParentProps } from 'solid-js';
import { For } from 'solid-js';
import { t } from '../../locales/translations.utils.ts';
import { MenuBar } from './MenuBar/MenuBar.tsx';
import { TimeBar } from './TimeBar/TimeBar.tsx';
import { setOption, vals } from '../../original/saving.ts';
import { formatTime, view } from '../../views/main.view.ts';
import { Popover } from '../../components/containers/Overlay/primitives/Popover.tsx';
import { clamp } from '../../original/helpers.ts';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Button } from '../../components/buttons/Button/Button.tsx';
import { createIntervalAccessor } from '../../signals/createInterval.ts';
import { Icon } from '../../components/buttons/Button/Icon.tsx';
import { ResourceList } from '../Statistics/ResourceList.tsx';
import { isBonusActive, manualRestart, performGamePause } from '../../original/driver.ts';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { CheckboxField } from '../../components/forms/CheckboxField.tsx';

const createStoryControls = () => {
  const [index, setIndex] = createSignal(0);
  const max = createIntervalAccessor(1, () => vals.storyMax);
  const next = () => setIndex(Math.min(index() + 1, max()));
  const previous = () => setIndex(Math.max(0, index() - 1));

  const story = createMemo(() => t('stories.items')[index()].story);

  return { story, index, next, previous, max };
};

const StoryOption = () => {
  const controls = createStoryControls();

  return (
    <Popover>
      <Popover.Trigger>
        <Button variant='text' class='font-bold flex items-center gap-2'>
          Story
          <Icon id='newStory' name='warning' class='w-6 h-6 text-amber-700' />
        </Button>
      </Popover.Trigger>
      <Popover.Content class='max-w-[400px]'>
        <div class='w-full flex items-center justify-between gap-2'>
          <ButtonIcon disabled={controls.index() === 0} name='chevronLeft' onClick={controls.previous} />
          <div>{controls.index() + 1}</div>
          <ButtonIcon disabled={controls.index() === controls.max()} name='chevronRight' onClick={controls.next} />
        </div>
        <span>{controls.story()}</span>
      </Popover.Content>
    </Popover>
  );
};

const Controls = (props: { class?: string }) => {
  const bonus = createIntervalAccessor({
    seconds: formatTime(vals.totalOfflineMs / 1000),
    isActive: isBonusActive(),
  }, () => ({
    seconds: formatTime(vals.totalOfflineMs / 1000),
    isActive: isBonusActive(),
  }));

  return (
    <div class={props.class}>
      <div class='flex gap-2'>
        <Button onClick={() => performGamePause()}>
          Play/Pause
        </Button>
        <Tooltip>
          <Tooltip.Trigger>
            <Button onClick={() => manualRestart()}>Restart</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Resets the loop. Not a hard reset.</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger>
            <Button onClick={() => setOption('bonusIsActive', !vals.options.bonusIsActive)}>
              Activate bonus
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>While this bonus is on, you get 19 extra seconds per second (20x game speed).</p>
            <p>
              You can adjust this speed or set a different speed for while this tab is in the background in the Extras
              menu.
            </p>
            <p>Accrue 1 bonus second per second when paused or offline. (capped at 1 month per offline period)</p>
            <p>
              Bonus is <span class='bold'>{bonus().isActive ? 'ON' : 'OFF'}</span>
            </p>
            <p>
              <span class='bold'>Total Bonus Seconds</span>
              <span>{bonus().seconds}</span>
            </p>
          </Tooltip.Content>
        </Tooltip>
        <StoryOption />
      </div>
      <div class='flex gap-2'>
        <CheckboxField
          onChange={(value) => setOption('pauseBeforeRestart', value)}
          value={vals.options.pauseBeforeRestart}
        >
          Pause before restart
        </CheckboxField>
        <CheckboxField
          onChange={(value) => setOption('pauseOnFailedLoop', value)}
          value={vals.options.pauseOnFailedLoop}
        >
          Pause on failed loop
        </CheckboxField>
        <CheckboxField
          onChange={(value) => setOption('pauseOnComplete', value)}
          value={vals.options.pauseOnComplete}
        >
          Pause on progress complete
        </CheckboxField>
      </div>
    </div>
  );
};

export const Header = () => (
  <header class='col-span-3 flex flex-col gap-2'>
    <TimeBar />
    <div class='grid grid-cols-3 gap-2'>
      <MenuBar />
      <Controls class='col-span-2' />
    </div>
  </header>
);
