import { createMemo } from 'solid-js';

export type EventType<T, E = Event> = E & { currentTarget: T; target: unknown };

export interface InputFieldProps<T> {
  id: string;
  value: T;
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
  onChange: (value: T, event: EventType<HTMLInputElement>) => void;
  validate?: (key: string, value: string, event: EventType<HTMLInputElement, KeyboardEvent>) => boolean;
  type: 'checkbox' | 'number' | 'text' | 'datetime-local' | 'file' | 'radio';
}

export const InputField = <T,>(props: InputFieldProps<T>) => {
  const value = createMemo(() => props.serialize(props.value));

  return (
    <input
      type='text'
      id={props.id}
      value={value()}
      onKeyPress={props.validate
        ? (event) => {
          if (props.validate!(event.key, event.currentTarget.value, event)) return;
          event.preventDefault();
        }
        : undefined}
      onInput={(event) => props.onChange(props.deserialize(event.currentTarget.value), event)}
      class={`
        h-8 pl-4 pr-2
        rounded-sm 
        border border-neutral-500 focus:border-neutral-700 
        outline-none 
        `}
    />
  );
};
