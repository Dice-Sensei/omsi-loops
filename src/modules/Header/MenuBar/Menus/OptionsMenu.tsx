import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';
import { HorizontalBar } from '../../../../components/flow/HorizontalBar/HorizontalBar.tsx';
import { CheckboxField } from '../../../../components/forms/CheckboxField.tsx';
import { NumberField } from '../../../../components/forms/NumberField.tsx';
import { Localization } from '../../../../original/localization.ts';
import { setOption } from '../../../../original/saving.ts';
import { et } from '../../../../locales/translations.utils.ts';
import { MenuOption } from './MenuOption.tsx';

const t = et('menu.options');
export const OptionsMenu = () => (
  <MenuOption title={t('title')}>
    <div class='flex flex-col gap-2'>
      <a target='_blank' href='https://discord.gg/dnKA6Xd'>Discord Link</a>
      <div class='flex gap-2'>
        <span>Language:</span>
        <select onChange={() => Localization.change()}>
          <option value='en-EN'>English</option>
        </select>
      </div>
      <HorizontalBar />
      <CheckboxField value={false} onChange={(value) => setOption('actionLog', value)}>
        <span>Show action log</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('highlightNew', value)}>
        <span>Highlight new actions</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('statColors', value)}>
        <span>Use stat colors in menu and tooltips</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('statHints', value)}>
        <span>Show stat hints on actions</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('pingOnPause', value)}>
        <span>Ping on pause</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('notifyOnPause', value)}>
        <span>Notify on pause</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('autoMaxTraining', value)}>
        <span>Max all training actions on cap increase</span>
      </CheckboxField>
      <CheckboxField value={false} onChange={(value) => setOption('hotkeys', value)}>
        <Tooltip>
          <Tooltip.Trigger>
            <span>Hotkeys</span>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <div class='flex flex-col gap-2'>
              <span>Spacebar: Pause/play</span>
              <span>R: Restart</span>
              <span>B: Toggle bonus seconds</span>
              <span>1-9: Set current action list multiplier to 1-9</span>
              <span>0: Multiply action list multiplier by 10</span>
              <span>Backspace: Remove last digit of action list multiplier</span>
              <span>Shift+1-5: Select and load loadout 1-5</span>
              <span>+/-: Increase/decrease action list size</span>
              <span>Shift+S: Save current list to selected loadout</span>
              <span>Shift+L: Load selected loadout</span>
              <span>Shift+C: Clear current list</span>
              <span>Right/D: Show next zone</span>
              <span>Left/A: Show previous zone</span>
              <span>Shift+Right/D: Show action stories</span>
              <span>Shift+Left/A: Show action options</span>
              <span>Shift+Z: Undo most recent change to action list</span>
            </div>
          </Tooltip.Content>
        </Tooltip>
      </CheckboxField>
      <HorizontalBar />
      Visual updates per second:
      <NumberField value={50} onChange={(value) => setOption('updateRate', value)} />
      Autosave rate (seconds):
      <NumberField value={30} onChange={(value) => setOption('autosaveRate', value)} />
    </div>
  </MenuOption>
);
