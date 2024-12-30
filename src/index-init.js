loadDefaults();

Localization.ready.then(() => {
  renderViews();
  Localization.localizePage('game');
  localStorage['loadingText'] = document.getElementById('loadingText').textContent;
  startGame();
});
