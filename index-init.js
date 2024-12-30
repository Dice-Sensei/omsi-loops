loadDefaults();

Localization.ready.then(() => {
  Views.draw();
  Localization.localizePage('game');
  localStorage['loadingText'] = document.getElementById('loadingText').textContent;
  startGame();
});
