import { Show } from 'solid-js';
import { t } from '../../locales/translations.utils.ts';
import { KeyboardKey } from '../hotkeys/KeyboardKey.ts';
import { TownInfos } from './TownInfos.tsx';
import { ActionControls } from './ActionControls.tsx';
import { TownControls } from './TownControls.tsx';

export const Towns = () => {
  return (
    <div class='border border-amber-500 rounded-sm'>
      <TownControls />
      <TownInfos />
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
