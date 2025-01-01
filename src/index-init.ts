import { renderViews } from './views/register-all.ts';

loadDefaults();

await globalThis.Localization.init();

renderViews();
globalThis.Localization.populate();

localStorage.setItem('loadingText', document.getElementById('loadingText').textContent);
startGame();
