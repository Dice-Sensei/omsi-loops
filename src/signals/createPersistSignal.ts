import { createEffect, createSignal, mergeProps, Signal } from 'solid-js';

export interface CreatePersistSignalOptions<T> {
  shouldClear: (value: T) => boolean;
  onClear: () => void;
  shouldSave: (value: T) => boolean;
  onSave: (value: T) => void;
  onLoad: () => T;
}

export const createPersistSignal = <T>($: CreatePersistSignalOptions<T>): Signal<T> => {
  const [get, set] = createSignal($.onLoad());

  createEffect(() => {
    const value = get();

    if ($.shouldClear(value)) {
      $.onClear();
    } else if ($.shouldSave(value)) {
      $.onSave(value);
    }
  });

  return [get, set];
};

export interface CreateLocalStorageSignalOptions<T> {
  key: string;
  fallback?: T;
  encode?: (value: T) => string;
  decode?: (value: string) => T;
  shouldClear?: (value: T) => boolean;
}

export const createLocalStorageSignal = <T = string | null>(
  props: CreateLocalStorageSignalOptions<T>,
): Signal<T> => {
  const $ = mergeProps({
    fallback: null as T,
    encode: JSON.stringify,
    decode: JSON.parse,
    shouldClear: (value: T) => value === props.fallback,
  }, props);

  return createPersistSignal({
    shouldClear: $.shouldClear,
    onClear: () => localStorage.removeItem($.key),
    shouldSave: (value) => {
      const item = localStorage.getItem($.key);

      return item ? $.encode(value) !== item : true;
    },
    onSave: (value) => localStorage.setItem($.key, $.encode(value)),
    onLoad: () => {
      const item = localStorage.getItem($.key);

      return item ? $.decode(item) : $.fallback;
    },
  });
};
