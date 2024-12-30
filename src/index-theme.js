if (localStorage['latestTheme']) {
  document.body.className = `t-${localStorage['latestTheme']} loading`;
}

if (localStorage['loadingText']) {
  document.getElementById('loadingText').textContent = localStorage['loadingText'];
}
