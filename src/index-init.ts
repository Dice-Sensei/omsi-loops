import { renderViews } from './views/register-all.ts';

loadDefaults();

Localization.ready.then(() => {
  renderViews();

  Localization.localizePage('game');

  localStorage.setItem('loadingText', document.getElementById('loadingText').textContent);

  startGame();
});
