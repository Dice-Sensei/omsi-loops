const latestTheme = localStorage.getItem('latestTheme');

if (latestTheme !== null) {
  document.body.className = `t-${latestTheme} loading`;
}
