import { renderViews } from './views/register-all.ts';

loadDefaults();

await Localization.init();

renderViews();
Localization.populate();

localStorage.setItem('loadingText', document.getElementById('loadingText').textContent);
startGame();
