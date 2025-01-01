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

namespace Localization {
  export const languages = { 'en-EN': 'English' };
  export const fallback = 'en-EN';

  export let language: null;
  export const searchParam = 'language';

  export const bundles: Record<string, XMLDocument> = {};

  export async function init() {
    language = SearchParams.get(searchParam, {
      expected: Object.keys(languages),
      fallback: fallback,
    });

    bundles[fallback] = await loadXml(fallback);
    bundles[language] = await loadXml(language);
  }

  export function populate(language: string = Localization.language) {
    const elements = document.querySelectorAll<HTMLElement>('.localized');

    for (const element of elements) {
      element.innerHTML = Localization.txt(element.dataset.locale, language);
    }
  }

  export function change() {
    SearchParams.set(searchParam, language);
  }

  async function loadXml(language: string): Promise<XMLDocument> {
    const response = await fetch(`locales/${language}/game.xml`);
    const text = await response.text();

    return new DOMParser().parseFromString(text, 'text/xml');
  }

  export function txt(path: string, language: string = Localization.language) {
    return Localization.txtsObj(path, language).text();
  }

  export function txtsObj(path: string, language: string = Localization.language) {
    return $(Localization.bundles[language]).find(path);
  }
}

globalThis.Localization = Localization;
