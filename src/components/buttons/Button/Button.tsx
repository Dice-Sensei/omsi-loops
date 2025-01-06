import { createLoadingCallback } from '../../../signals/createLoadingCallback.ts';
import { type ParentProps, Show } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { Spinner } from '../../flow/Spinner/Spinner.tsx';

export type ButtonProps = ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = (props: ButtonProps) => {
  const [isLoading, handleClick] = createLoadingCallback(props.onClick);

  return (
    <button class='button !min-w-40 min-h-8' {...props} onClick={handleClick} disabled={isLoading() || props.disabled}>
      <Show when={!isLoading()} fallback={<Spinner />}>
        {props.children}
      </Show>
    </button>
  );
};
