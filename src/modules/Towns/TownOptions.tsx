import { Show } from 'solid-js';
import { t } from '../../locales/translations.utils.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';

export const TownOptions = () => (
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
);
