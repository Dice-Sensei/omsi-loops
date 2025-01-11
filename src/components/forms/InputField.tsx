import { createUniqueId, mergeProps } from 'solid-js';
import cx from 'clsx';

export type EventType<T, E = Event> = E & { currentTarget: T; target: unknown };

export interface InputFieldProps<T> {
  id?: string;
  disabled?: boolean;
  class?: string;
  value: T;
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
  onChange: (value: T, event: EventType<HTMLInputElement>) => void;
  validate?: (key: string, value: string, event: EventType<HTMLInputElement, KeyboardEvent>) => boolean;
  type: 'checkbox' | 'number' | 'text' | 'datetime-local' | 'file' | 'radio';
}

export const InputField = <T,>(props: InputFieldProps<T>) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId() }, props);

  return (
    <input
      type={$.type}
      id={$.id}
      disabled={$.disabled}
      value={$.serialize($.value)}
      onKeyPress={$.validate
        ? (event) => {
          if ($.validate!(event.key, event.currentTarget.value, event)) return;
          event.preventDefault();
        }
        : undefined}
      onInput={(event) => $.onChange($.deserialize(event.currentTarget.value), event)}
      class={cx(
        `
        pl-4 pr-2 h-8
        cursor-text
        rounded-sm 
        border border-neutral-500 focus:border-neutral-700 
        disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:border-neutral-300
        outline-none 
        `,
        $.class,
      )}
    />
  );
};
