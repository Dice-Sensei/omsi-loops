import { createSignal, For, Match, Show, Switch } from 'solid-js';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { t } from '../../locales/translations.utils.ts';
import { vals } from '../../original/saving.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';
import { townNames } from '../../original/actionList.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';

export namespace TownControlsNs {
  type TownIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  export const [isHiding, setIsHiding] = createSignal(false);
  export const toggleHiding = () => setIsHiding(!isHiding());

  export const towns = () => vals.townsUnlocked.map((index) => townNames[index]);

  export const [index, setIndex] = createSignal<TownIndex>(0);
  export const canSelectPrevious = () => index() > 0;
  export const canSelectNext = () => index() < vals.townsUnlocked.length - 1;

  export const selectPrevious = () => {
    if (!canSelectPrevious()) return;
    setIndex(index() - 1 as TownIndex);
  };

  export const selectNext = () => {
    if (!canSelectNext()) return;
    setIndex(index() + 1 as TownIndex);
  };
}

const TownControls = () => {
  const { index, canSelectPrevious, canSelectNext, selectPrevious, selectNext, isHiding, toggleHiding } =
    TownControlsNs;

  const [towns] = createIntervalSignal([], TownControlsNs.towns);

  return (
    <div class='h-12 relative flex items-center justify-center gap-4 bg-amber-300 border-amber-500 border-b'>
      <ButtonIcon disabled={!canSelectPrevious()} name='chevronLeft' onClick={selectPrevious} />
      <Label label={t(`towns.town${index()}.desc`)}>
        <select class='font-medium h-8 w-48 px-2 rounded-sm border-amber-500 border'>
          <For each={towns()}>
            {(town, index) => <option value={index()}>{town}</option>}
          </For>
        </select>
      </Label>
      <ButtonIcon disabled={!canSelectNext()} name='chevronRight' onClick={selectNext} />
      <ButtonIcon
        name={isHiding() ? 'eyeSlash' : 'eye'}
        class='absolute right-2'
        onClick={toggleHiding}
      />
    </div>
  );
};

export namespace ActionControlsNs {
  enum Mode {
    Options = 'options',
    Stories = 'stories',
  }

  const [showMode, setShowMode] = createSignal<Mode>(Mode.Options);
  export const isOptions = () => showMode() === Mode.Options;
  export const isStories = () => showMode() === Mode.Stories;
  export const toggleOptions = () => setShowMode(isOptions() ? Mode.Stories : Mode.Options);
  export const toggleStories = () => setShowMode(isStories() ? Mode.Options : Mode.Stories);
}

const ActionControls = () => {
  const { isOptions, isStories, toggleOptions, toggleStories } = ActionControlsNs;

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
      <div class='grid grid-cols-4 gap-2'>
        <div id='actionOptionsTown0'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown1'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown2'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown3'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown4'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown5'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown6'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown7'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <div id='actionOptionsTown8'>
          <div class='actionDiv'></div>
          <div class='travelDiv'></div>
        </div>
        <Show when={KeyboardKey.shift()}>
          <div>* {t('actionList.tooltips.addAtCap')}</div>
        </Show>
      </div>
      <div class='grid grid-cols-4 gap-2'>
        <div id='actionStoriesTown0'></div>
        <div id='actionStoriesTown1'></div>
        <div id='actionStoriesTown2'></div>
        <div id='actionStoriesTown3'></div>
        <div id='actionStoriesTown4'></div>
        <div id='actionStoriesTown5'></div>
        <div id='actionStoriesTown6'></div>
        <div id='actionStoriesTown7'></div>
        <div id='actionStoriesTown8'></div>
      </div>
    </div>
  );
};
