import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { createTranslator } from './createTranslator.ts';

describe('translations', () => {
  it('should create an extendable translator', () => {
    const [t, extendT] = createTranslator({ item: { amount: 'Amount' } });

    expect(t('item.amount')).toBe('Amount');

    const extendedT = extendT('item');

    expect(extendedT('amount')).toBe('Amount');
  });
});
