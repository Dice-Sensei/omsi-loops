import { onCleanup } from 'solid-js';

export const createInterval = (fn: () => Promise<void> | void, ms: number = 1000) => {
  const id = setInterval(fn, ms);
  onCleanup(() => clearInterval(id));
};
