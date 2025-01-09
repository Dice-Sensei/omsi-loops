import { Localization } from './localization.ts';
import { loadDefaults, startGame } from './saving.ts';

import { renderViews } from './views/register-all.ts';

loadDefaults();

await Localization.init();

renderViews();
Localization.populate();

startGame();
