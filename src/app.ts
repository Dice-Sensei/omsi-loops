import './styles.css';

import { render } from 'solid-js/web';
import { Application } from './Application.tsx';
import { Localization } from './original/localization.ts';
import { loadDefaults, startGame } from './original/saving.ts';

const main = document.getElementById('app');
if (main) render(Application, main);

loadDefaults();

await Localization.init();

startGame();
