import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { Base64 } from './Base64.ts';

describe('utils - Base64', () => {
  it('should encode and decode a string', () => {
    const encoded = Base64.encode('Hello, world!');
    const decoded = Base64.decode(encoded);

    expect(decoded).toBe('Hello, world!');
  });

  it('should encode and decode an object', () => {
    const encoded = Base64.encode({ a: 1, b: 2 });
    const decoded = Base64.decode(encoded);

    expect(decoded).toEqual({ a: 1, b: 2 });
  });
});
