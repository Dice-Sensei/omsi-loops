const latestTheme = localStorage.getItem('latestTheme');

export namespace Element {
  export const body = () => document.body as HTMLBodyElement;
  export const loadingText = () => document.getElementById('loadingText') as HTMLSpanElement;
}

if (latestTheme !== null) {
  Element.body().className = `t-${latestTheme} loading`;
}

const loadingText = localStorage.getItem('loadingText');

if (loadingText !== null) {
  Element.loadingText().textContent = loadingText;
}
