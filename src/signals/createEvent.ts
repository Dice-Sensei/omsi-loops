import { createEffect, onCleanup } from 'solid-js';

interface CreateEventOptions<T extends keyof HTMLElementEventMap> {
  type: T;
  fn: (event: HTMLElementEventMap[T]) => void;
  disabled?: boolean;
}

export const createEvent = <T extends keyof HTMLElementEventMap>(options: CreateEventOptions<T>) =>
  createEffect(() => {
    if (options.disabled) return;

    document.addEventListener(options.type, options.fn);
    onCleanup(() => document.removeEventListener(options.type, options.fn));
  });
