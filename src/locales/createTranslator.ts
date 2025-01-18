import { Path } from '@nimir/a-path';
import { memoize } from '../utils/memoize.ts';

export type TranslateFn<O> = <P extends Path<O>>(path: P) => Path.At<O, P>;
export type ExtendedTranslateFn<O> = <const K extends Path<O>>(prefix: K) => TranslateFn<Path.At<O, K>>;

export const createTranslate = <const O>(translations: O): TranslateFn<O> =>
  memoize((path) => Path.get(translations as never, path as never));

export const extendTranslate = <const O>(translate: TranslateFn<O>): ExtendedTranslateFn<O> => (prefix) => (path) =>
  translate(prefix + '.' + path as never);

export type Translator<O> = [translate: TranslateFn<O>, extend: ExtendedTranslateFn<O>];
export const createTranslator = <const O>(translations: O): Translator<O> => {
  const translate = createTranslate(translations);
  const extend = extendTranslate(translate);

  return [translate, extend];
};
