import { TownInfos } from './TownInfos.tsx';
import { ActionControls } from './ActionControls.tsx';
import { TownControls } from './TownControls.tsx';
import { TownOptions } from './TownOptions.tsx';
import { TownStories } from './TownStories.tsx';

export const Towns = () => (
  <div class='border border-amber-500 rounded-sm'>
    <TownControls />
    <TownInfos />
    <ActionControls />
    <TownOptions />
    <TownStories />
  </div>
);
