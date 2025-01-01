import { renderViews } from './views/register-all.ts';

globalThis.saving.loadDefaults();

await globalThis.Localization.init();

renderViews();
globalThis.Localization.populate();

localStorage.setItem('loadingText', document.getElementById('loadingText').textContent);
globalThis.saving.startGame();
