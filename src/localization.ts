namespace SearchParams {
  const self = () => new URLSearchParams(globalThis.location.search);

  type GetOptions<T extends string | null> = {
    expected: T[];
    fallback: T;
  };

  export const get = <T extends string | null = string | null>(name: string, options: GetOptions<T>): T => {
    const value = self().get(name) as T;

    return value && options.expected.includes(value) ? value : options.fallback;
  };

  export const set = <T extends string>(name: string, value: T | null): void => {
    const params = self();

    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    globalThis.location.search = params.toString();
  };
}

const Localization = {
  languages: { 'en-EN': 'English' },
  fallback: 'en-EN',

  language: null,
  searchParam: 'language',

  bundles: {},

  async init() {
    Localization.language = SearchParams.get(Localization.searchParam, {
      expected: Object.keys(Localization.languages),
      fallback: Localization.fallback,
    });

    Localization.bundles[Localization.fallback] = await Localization.loadXml(Localization.fallback);
    Localization.bundles[Localization.language] = await Localization.loadXml(Localization.language);
  },
  populate(language: string = Localization.language) {
    const elements = document.querySelectorAll<HTMLElement>('.localized');

    for (const element of elements) {
      element.innerHTML = Localization.txt(element.dataset.locale, language);
    }
  },
  change() {
    SearchParams.set(Localization.searchParam, Localization.language);
  },
  async loadXml(language: string): Promise<XMLDocument> {
    const response = await fetch(`locales/${language}/game.xml`);
    const text = await response.text();

    return new DOMParser().parseFromString(text, 'text/xml');
  },

  txt: (path: string, language: string = Localization.language) => {
    return Localization.txtsObj(path, language).text();
  },

  txtsObj: (path: string, language: string = Localization.language) => {
    return $(Localization.bundles[language]).find(path);
  },
};
globalThis.Localization = Localization;

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

  memoize(property: string, subPath: string = `>${property}`) {
    let value = this.txtsObj.find(subPath).text();
    if (!value) value = Localization.txt(this.#rootPath + subPath, this.#lib);

    Object.defineProperty(this, property, { value, configurable: true });

    return value;
  }
}
