import { Path } from '@nimir/a-path';
import { memoize } from './memoize.ts';

type TemplateKeys<T extends string> = T extends `${string}{{${infer P}}}${infer R}` ? P | TemplateKeys<R> : never;

type TemplateOptions<T extends string> = {
  [K in TemplateKeys<T>]: string | number;
};

export type TranslateFn<O> = <P extends Path<O>>(path: P, options?: TemplateOptions<P>) => Path.At<O, P>;
export type ExtendedTranslateFn<O> = <const K extends Path<O>>(prefix: K) => TranslateFn<Path.At<O, K>>;

export const createTranslate = <const O>(translations: O): TranslateFn<O> =>
  memoize((path, options) => {
    let value = Path.get(translations as never, path as never);
    if (options === undefined) return value;

    for (const key in options) {
      value = value.replace(`{{${key}}}`, options[key]);
    }

    return value;
  }, (path, options) => (options ? path + JSON.stringify(options) : path));

export const extendTranslate =
  <const O>(translate: TranslateFn<O>): ExtendedTranslateFn<O> => (prefix) => (path, options) =>
    translate(prefix + '.' + path as never, options as never);

export type Translator<O> = [translate: TranslateFn<O>, extend: ExtendedTranslateFn<O>];
export const createTranslator = <const O>(translations: O): Translator<O> => {
  const translate = createTranslate(translations);
  const extend = extendTranslate(translate);

  return [translate, extend];
};
