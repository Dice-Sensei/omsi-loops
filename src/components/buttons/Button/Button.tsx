import { createLoadingCallback } from '../../../signals/createLoadingCallback.ts';
import { mergeProps, type ParentProps, Show } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { Spinner } from '../../flow/Spinner/Spinner.tsx';
import cx from 'clsx';

export type ButtonProps = ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'text';
};

export const Button = (props: ButtonProps) => {
  const $ = mergeProps({ variant: 'primary' }, props);
  const [isLoading, handleClick] = createLoadingCallback($.onClick);

  return (
    <button
      type='button'
      {...$}
      class={cx(
        'min-h-8',
        $.variant === 'primary' && `
        text-slate-950
        border rounded-sm
        bg-amber-500 active:bg-amber-600 hover:bg-amber-400 
        border-amber-600 active:border-amber-700
        disabled:bg-amber-300 disabled:border-amber-400 
        disabled:text-neutral-500 disabled:cursor-not-allowed
        transition-all duration-100
        `,
        $.variant === 'text' && `
        text-neutral-900 hover:text-amber-600 active:text-amber-800
        disabled:text-neutral-500 disabled:cursor-not-allowed
        `,
        $.class,
      )}
      onClick={handleClick}
      disabled={isLoading() || $.disabled}
    >
      <Show when={!isLoading()} fallback={<Spinner />}>
        {$.children}
      </Show>
    </button>
  );
};
