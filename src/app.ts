import { Localization } from './localization.ts';
import './actionList.ts';
import './stats.ts';
import './views/main.view.ts';
import './saving.ts';

import { renderViews } from './views/register-all.ts';

globalThis.saving.loadDefaults();

await Localization.init();

renderViews();
Localization.populate();

globalThis.saving.startGame();
