import './styles.css';
import './stats-graph.ts';
import './index-theme.ts';
import './data.ts';
import './Localization.ts';
import './helpers.ts';
import './actionList.ts';
import './interval.ts';
import './driver.ts';
import './stats.ts';
import './actions.ts';
import './views/main.view.ts';
import './town.ts';
import './prestige.ts';
import './globals.ts';
import './saving.ts';
import './challenges.ts';
import './keyboard.hotkeys.ts';
import './predictor.ts';

import { renderViews } from './views/register-all.ts';
import { Tutorial } from './modules/tutorial.tsx';
import { render } from 'solid-js/web';

render(Tutorial, document.getElementById('tutorial')!);

globalThis.saving.loadDefaults();

await globalThis.Localization.init();

renderViews();
globalThis.Localization.populate();

globalThis.saving.startGame();
