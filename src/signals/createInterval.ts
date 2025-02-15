import { createSignal, onCleanup, Signal } from 'solid-js';

export const createInterval = (fn: () => Promise<unknown> | unknown, ms: number): void => {
  const id = setInterval(fn, ms);
  onCleanup(() => clearInterval(id));
};

export const createIntervalSignal = <T>(
  initial: T,
  fn: (previous: T) => T,
  compare: (a: T, b: T) => boolean = Object.is,
  ms: number = 10,
): Signal<T> => {
  const [value, setValue] = createSignal<T>(initial);

  createInterval(() => {
    setValue((value) => {
      const previous = value;
      const next = fn(previous);

      if (compare(previous, next)) return previous;
      return next;
    });
  }, ms);

  return [value, setValue];
};
