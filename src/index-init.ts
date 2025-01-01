import { renderViews } from './views/register-all.ts';

loadDefaults();

if (typeof window !== 'undefined') {
  Localization.init();

  Localization.loadLib('fallback', () => {
    Localization.loadLib('game', () => Localization.setReady());
  });
}

Localization.ready.then(() => {
  renderViews();

  Localization.localizePage('game');
  localStorage.setItem('loadingText', document.getElementById('loadingText').textContent);

  startGame();
});
