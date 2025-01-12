import $ from 'jquery';
import { SearchParams } from '../logic/search-params.ts';

export namespace Localization {
  export const languages = { 'en-EN': 'English' };
  export const fallback = 'en-EN';

  export const searchParam = 'language';

  export const bundles: Record<string, XMLDocument> = {};

  export let language: string = SearchParams.get(searchParam, {
    expected: Object.keys(languages),
    fallback: fallback,
  });
  export async function init() {
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
