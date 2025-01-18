import type { Ref } from 'solid-js';

export interface Reference<T> {
  (reference: Ref<T>): void;
  get active(): T;
}

export const createRef = <T>(): Reference<T> => {
  let value!: T;
  return Object.defineProperty((ref) => value = ref, 'active', { get: () => value });
};
