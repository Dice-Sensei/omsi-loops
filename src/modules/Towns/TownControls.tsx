import { createSignal, For } from 'solid-js';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { t } from '../../locales/translations.utils.ts';
import { townNames } from '../../original/actionList.ts';
import { vals } from '../../original/saving.ts';
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
export const TownControls = () => {
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
