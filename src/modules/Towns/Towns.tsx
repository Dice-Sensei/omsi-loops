import { createMemo, createSignal, Match, Show, Switch } from 'solid-js';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { t } from '../../locales/translations.utils.ts';
import { vals } from '../../original/saving.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';
import { view } from '../../views/main.view.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';

const TownControls = () => {
  const [values] = createIntervalSignal({
    townShowing: vals.townShowing as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    canMoveLeft: vals.townShowing > Math.min(...vals.townsUnlocked),
    canMoveRight: vals.townShowing < Math.max(...vals.townsUnlocked),
  }, () => ({
    townShowing: vals.townShowing as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    canMoveLeft: vals.townShowing > Math.min(...vals.townsUnlocked),
    canMoveRight: vals.townShowing < Math.max(...vals.townsUnlocked),
  }));

  return (
    <div class='h-12 relative flex items-center justify-center gap-4 bg-amber-300 border-amber-500 border-b'>
      <ButtonIcon
        disabled={values().canMoveLeft}
        name='chevronLeft'
        onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townShowing) - 1])}
      />
      <Label label={t(`towns.town${values().townShowing}.desc`)}>
        <select class='font-medium w-48' id='TownSelect' />
      </Label>
      <ButtonIcon
        disabled={values().canMoveRight}
        name='chevronRight'
        onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townShowing) + 1])}
      />
      <ButtonIcon name='eyeSlash' class='absolute right-2' onClick={() => view.toggleHiding()}></ButtonIcon>
    </div>
  );
};

const ActionControls = () => {
  enum Mode {
    Options = 'options',
    Stories = 'stories',
  }
  const [showMode, setShowMode] = createSignal<Mode>(Mode.Options);
  const isOptions = createMemo(() => showMode() === Mode.Options);
  const isStories = createMemo(() => showMode() === Mode.Stories);
  const toggleOptions = () => setShowMode(isOptions() ? Mode.Stories : Mode.Options);
  const toggleStories = () => setShowMode(isStories() ? Mode.Options : Mode.Stories);

  return (
    <Label label={t('actionList.tooltips.actionExplaination')}>
      <div class='h-8 border-y bg-amber-300 border-amber-500 w-full flex justify-center items-center gap-4'>
        <ButtonIcon disabled={isOptions()} name='chevronLeft' onClick={toggleOptions} />
        <span class='font-bold w-40 text-center'>
          <Switch>
            <Match when={isOptions()}>
              {t('actionList.tooltips.actionOptions')}
            </Match>
            <Match when={isStories()}>
              {t('actionList.tooltips.actionStories')}
            </Match>
          </Switch>
        </span>
        <ButtonIcon disabled={isStories()} name='chevronRight' onClick={toggleStories} />
      </div>
    </Label>
  );
};

export const Towns = () => {
  return (
    <div class='border border-amber-500 rounded-sm'>
      <TownControls />
      <div id='townInfos'>
        <div id='townInfo0' class='townInfo'></div>
        <div id='townInfo1' class='townInfo'></div>
        <div id='townInfo2' class='townInfo'></div>
        <div id='townInfo3' class='townInfo'></div>
        <div id='townInfo4' class='townInfo'></div>
        <div id='townInfo5' class='townInfo'></div>
        <div id='townInfo6' class='townInfo'></div>
        <div id='townInfo7' class='townInfo'></div>
        <div id='townInfo8' class='townInfo'></div>
      </div>
      <ActionControls />
      <div id='townActions'>
        <div id='actionOptionsTown0' class='actionOptions'></div>
        <div id='actionOptionsTown1' class='actionOptions'></div>
        <div id='actionOptionsTown2' class='actionOptions'></div>
        <div id='actionOptionsTown3' class='actionOptions'></div>
        <div id='actionOptionsTown4' class='actionOptions'></div>
        <div id='actionOptionsTown5' class='actionOptions'></div>
        <div id='actionOptionsTown6' class='actionOptions'></div>
        <div id='actionOptionsTown7' class='actionOptions'></div>
        <div id='actionOptionsTown8' class='actionOptions'></div>
        <Show when={KeyboardKey.shift()}>
          <div>
            * {t('actionList.tooltips.addAtCap')}
          </div>
        </Show>
      </div>
      <div id='townActions'>
        <div id='actionStoriesTown0' class='actionStories'></div>
        <div id='actionStoriesTown1' class='actionStories'></div>
        <div id='actionStoriesTown2' class='actionStories'></div>
        <div id='actionStoriesTown3' class='actionStories'></div>
        <div id='actionStoriesTown4' class='actionStories'></div>
        <div id='actionStoriesTown5' class='actionStories'></div>
        <div id='actionStoriesTown6' class='actionStories'></div>
        <div id='actionStoriesTown7' class='actionStories'></div>
        <div id='actionStoriesTown8' class='actionStories'></div>
      </div>
    </div>
  );
};
