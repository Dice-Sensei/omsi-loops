import { createMemo, createSignal, ParentProps } from 'solid-js';
import { For } from 'solid-js';
import { t } from '../../locales/translations.utils.ts';
import { MenuBar } from './MenuBar/MenuBar.tsx';
import { TimeBar } from './TimeBar/TimeBar.tsx';
import { setOption, vals } from '../../original/saving.ts';
import { view } from '../../views/main.view.ts';
import { Popover } from '../../components/containers/Overlay/primitives/Popover.tsx';
import { clamp } from '../../original/helpers.ts';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Button } from '../../components/buttons/Button/Button.tsx';
import { createIntervalSignal } from '../../signals/createInterval.ts';
import { Icon } from '../../components/buttons/Button/Icon.tsx';
import { Resources } from './Resources.tsx';

const createStoryControls = () => {
  const [index, setIndex] = createSignal(0);
  const [max] = createIntervalSignal(1, () => vals.storyMax);
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

const Controls = () => {
  return (
    <div>
      <div>
        <button id='pausePlay' class='button control'>Play</button>
        <button id='manualRestart' class='button showthat control'>
          Restart
          <div class='showthis' style='color:var(--default-color);width:230px;'>
            Resets the loop. Not a hard reset.
          </div>
        </button>
        <input
          id='bonusIsActiveInput'
          type='checkbox'
          onchange={() => setOption('bonusIsActive', !vals.options.bonusIsActive)}
        >
        </input>
        <button id='toggleOfflineButton' class='button showthat control'>
          Bonus Seconds
          <div class='showthis' id='bonusText' style='max-width:500px;color:var(--default-color);'>
            <p>While this bonus is on, you get 19 extra seconds per second (20x game speed).</p>
            <p>
              You can adjust this speed or set a different speed for while this tab is in the background in the Extras
              menu.
            </p>
            <p>Accrue 1 bonus second per second when paused or offline. (capped at 1 month per offline period)</p>
            <p>
              Bonus is <span class='bold' id='isBonusOn'>ON</span>
            </p>
            <p>
              <span class='bold'>Total Bonus Seconds</span> <span id='bonusSeconds'>16d 8h 12m 27s</span>
            </p>
          </div>
        </button>
        <StoryOption />
      </div>
      <div>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseBeforeRestartInput'
            onChange={({ target: { checked } }) => setOption('pauseBeforeRestart', checked)}
          >
          </input>
          <label for='pauseBeforeRestartInput'>Pause before restart</label>
        </div>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseOnFailedLoopInput'
            onChange={({ target: { checked } }) => setOption('pauseOnFailedLoop', checked)}
          >
          </input>
          <label for='pauseOnFailedLoopInput'>Pause on failed loop</label>
        </div>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseOnCompleteInput'
            onChange={({ target: { checked } }) => setOption('pauseOnComplete', checked)}
          >
          </input>
          <label for='pauseOnCompleteInput'>Pause on progress complete</label>
        </div>
      </div>
    </div>
  );
};

export const Header = () => (
  <header class='col-span-3 flex flex-col gap-2'>
    <TimeBar />
    <div class='grid grid-cols-3 gap-2'>
      <MenuBar />
      <Controls />
      <Resources />
    </div>
  </header>
);
