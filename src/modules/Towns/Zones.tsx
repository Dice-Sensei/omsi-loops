import { ZoneStatistics } from './TownInfos.tsx';
import { ZoneOptionControls } from './ActionControls.tsx';
import { ZoneControls } from './TownControls.tsx';
import { ZoneOptionsSelects } from './TownOptions.tsx';
import { ZoneOptionsStories } from './TownStories.tsx';

export const Zones = () => (
  <div class='border border-amber-500 rounded-sm max-h-[400px] overflow-y-auto'>
    <ZoneControls />
    <ZoneStatistics />
    <ZoneOptionControls />
    <ZoneOptionsSelects />
    <ZoneOptionsStories />
  </div>
);
