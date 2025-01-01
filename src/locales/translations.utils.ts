import { memoize } from '../utils/memoize.ts';
import { translationsEn } from './translations.en.ts';

import { Path } from 'a-path';

export type Translations = typeof translationsEn;

export const t = memoize(<const P extends Path<Translations>>(path: P): Path.At<Translations, P> =>
  Path.get(translationsEn, path)
);

const _t = t;
declare global {
  var t: typeof _t;
}

globalThis.t = _t;
