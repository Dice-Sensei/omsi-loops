import { type ParentProps } from 'solid-js';
import cx from 'clsx';

export interface CardProps {
  class?: string;
}

export const Card = (props: ParentProps<CardProps>) => {
  return (
    <div
      class={cx(
        `
        p-4
        border rounded-sm border-neutral-500 hover:border-neutral-700 
        bg-white 
        transition-all duration-100
        `,
        props.class,
      )}
    >
      {props.children}
    </div>
  );
};
