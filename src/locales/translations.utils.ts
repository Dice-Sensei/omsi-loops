import { createTranslator } from '../utils/createTranslator.ts';
import { translationsEn } from './translations.en.ts';

export type Translations = typeof translationsEn;

export const [t, et] = createTranslator(translationsEn);
