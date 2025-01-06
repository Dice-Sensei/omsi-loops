import { createEvent } from '../../../signals/createEvent.ts';
import { type ParentProps, Show } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import cx from 'clsx';

const ModalDivider = () => (
  <div class='h-0 w-full border-b border-neutral-300 group-hover:border-neutral-400 transition-all duration-100' />
);

interface ModalTitleProps extends ParentProps {
  title: JSX.Element;
  onClose?: () => void;
}

const ModalTitle = (props: ModalTitleProps) => (
  <span class='text-lg font-bold text-amber-700'>
    <div class='flex justify-between items-center min-h-8'>
      {props.title}
      <Show when={props.onClose}>
        <button
          onClick={props.onClose}
          class='
          hover:bg-neutral-300 focus:bg-neutral-300 
          text-neutral-500 hover:text-neutral-700 focus:text-neutral-700
          aspect-square min-w-8 min-h-8 rounded-full
          transition-all duration-100
        '
        >
          &times;
        </button>
      </Show>
    </div>
    <ModalDivider />
  </span>
);
const ModalActions = (props: ParentProps) => (
  <div class='flex flex-col w-full items-end gap-2 mt-auto'>
    <ModalDivider />
    {props.children}
  </div>
);

interface ModalBackdropProps extends ParentProps {
  onBackgroundClick?: () => void;
}

const ModalBackdrop = (props: ModalBackdropProps) => (
  <div class='absolute w-full h-full backdrop-blur' onClick={props.onBackgroundClick}></div>
);

interface ModalProps extends ParentProps {
  title: JSX.Element;
  Actions: () => JSX.Element;
  onBackgroundClick?: () => void;
  onClose?: () => void;
  class?: string;
}

export const Modal = (props: ModalProps) => {
  createEvent({
    type: 'keydown',
    fn: ({ key }) => {
      if (!props.onBackgroundClick || key !== 'Escape') return;
      props.onBackgroundClick();
    },
    disabled: !props.onBackgroundClick,
  });

  return (
    <div class='absolute w-full h-full left-0 top-0 z-50' role='dialog' aria-modal='true'>
      <div class='relative w-full h-full'>
        <ModalBackdrop onBackgroundClick={props.onBackgroundClick} />
        <div
          class={cx(
            `
            absolute p-4
            left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            flex flex-col gap-2
            bg-neutral-100
            border rounded-sm border-neutral-500 hover:border-neutral-700
            border-t-2 rounded-t-none border-t-amber-300 hover:border-t-amber-500
            group
            transition-all duration-100
          `,
            props.class,
          )}
        >
          <Show when={props.title}>
            <ModalTitle title={props.title} onClose={props.onClose} />
          </Show>
          {props.children}
          <ModalActions>
            <props.Actions />
          </ModalActions>
        </div>
      </div>
    </div>
  );
};
