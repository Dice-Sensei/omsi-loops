import { createSignal, onCleanup, Signal } from 'solid-js';

export const createInterval = (fn: () => Promise<unknown> | unknown, ms: number): void => {
  const id = setInterval(fn, ms);
  onCleanup(() => clearInterval(id));
};

export const createIntervalSignal = <T>(initial: T, fn: (previous: T) => T, ms: number = 10): Signal<T> => {
  const [value, setValue] = createSignal<T>(initial);

  createInterval(() => setValue(fn), ms);

  return [value, setValue];
};
