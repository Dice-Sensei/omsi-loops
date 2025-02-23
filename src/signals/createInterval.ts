import { Accessor, createSignal, onCleanup } from 'solid-js';
import { deepEqual } from 'fast-equals';

export const createInterval = (fn: () => Promise<unknown> | unknown, ms: number): void => {
  const id = setInterval(fn, ms);
  onCleanup(() => clearInterval(id));
};

export const createIntervalAccessor = <T>(
  initial: T,
  fn: (previous: T) => T,
  compare: (a: T, b: T) => boolean = deepEqual,
  ms: number = 10,
): Accessor<T> => {
  const [value, setValue] = createSignal<T>(initial);

  createInterval(() => {
    setValue((value) => {
      const previous = value;
      const next = fn(previous);

      if (compare(previous, next)) return previous;
      return next;
    });
  }, ms);

  return value;
};
