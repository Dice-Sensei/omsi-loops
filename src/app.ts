import { Localization } from './localization.ts';
import './saving.ts';

import { renderViews } from './views/register-all.ts';

globalThis.saving.loadDefaults();

await Localization.init();

renderViews();
Localization.populate();

globalThis.saving.startGame();
