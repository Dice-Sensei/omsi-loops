const Localization = {
  languages: { 'en-EN': 'English' },
  fallback: 'en-EN',

  language: null,
  searchParam: 'language',

  bundles: {},
  lastLib: null,

  ready: null,

  async init() {
    const params = new URLSearchParams(globalThis.location.search);
    let language = params.get(Localization.searchParam);
    if (language && !(language in Localization.languages)) {
      language = Localization.fallback;
    }

    Localization.language = language ?? Localization.fallback;

    await Localization.loadLanguage(Localization.fallback);
    await Localization.loadLanguage(Localization.language);
  },
  async loadLanguage(language: string): Promise<void> {
    Localization.bundles[language] = await Localization.loadXml(language);
  },
  populate(language: string = Localization.language) {
    const elements = document.querySelectorAll<HTMLElement>('.localized');

    for (const element of elements) {
      element.innerHTML = Localization.txt(element.dataset.locale, language);
    }
  },
  change() {
    const params = new URLSearchParams(globalThis.location.search);
    params.set(Localization.searchParam, Localization.language);

    globalThis.location.search = params.toString();
  },
  async loadXml(language: string): Promise<XMLDocument> {
    const response = await fetch(`locales/${language}/game.xml`);
    const text = await response.text();

    return new DOMParser().parseFromString(text, 'text/xml');
  },
  txt(path: string, language: string = Localization.language) {
    const bundle = $(Localization.bundles[language]);

    let txt;
    if (bundle.length) txt = $(Localization.bundles[language]).find(path).text();

    if (txt === '') {
      console.warn(`Missing text in lang '${Localization.language}' for key ${path} in lib ${language}`);
      txt = $(Localization.bundles[Localization.fallback]).find(path).text();

      if (txt === '') {
        console.warn(`Missing fallback for key ${path}`);
        txt = `[${path}]`;
      }
    }
    return txt;
  },
  txtsObj(path: string, language: string = Localization.language) {
    return $(Localization.bundles[language]).find(path);
  },
};

class Localizable {
  #txtsObj: JQuery<HTMLElement>;
  #rootPath: string;
  #lib: string;

  get rootPath() {
    return this.#rootPath;
  }
  get lib() {
    return this.#lib;
  }
  get txtsObj() {
    return this.#txtsObj ??= Localization.txtsObj(this.#rootPath, this.#lib);
  }

  constructor(rootPath: string, lib: string) {
    this.#rootPath = rootPath;
    this.#lib = lib;
  }

  txt(subPath: string) {
    const txt = this.txtsObj.find(subPath).text();

    return txt !== '' ? txt : Localization.txt(this.#rootPath + subPath, this.#lib);
  }

  memoizeValue(property: string, value: string) {
    if (Object.hasOwn(this, property)) {
      delete this[property];
    }

    Object.defineProperty(this, property, { value, configurable: true });
    return value;
  }

  memoize(property: string, subPath: string = `>${property}`) {
    const value = this.txt(subPath);

    return this.memoizeValue(property, value);
  }
}
