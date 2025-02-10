import { createSignal, Match, Switch } from 'solid-js';
import { ButtonIcon } from '../../components/buttons/Button/ButtonIcon.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { t } from '../../locales/translations.utils.ts';

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
export const ActionControls = () => {
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
