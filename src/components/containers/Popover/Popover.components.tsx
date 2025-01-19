import cx from 'clsx';
import { ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface PopoverArrowProps {
  class?: string;
}

export const PopoverArrow = (props: PopoverArrowProps) => (
  <div data-popover-arrow class={cx('absolute w-2 h-2 bg-inherit border-inherit', props.class)} />
);
PopoverArrow.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.popoverArrow !== undefined;

export interface PopoverTargetProps extends ParentProps {
  class?: string;
}

export const PopoverTarget = (props: PopoverTargetProps) => (
  <div data-popover-target class={props.class}>{props.children}</div>
);
PopoverTarget.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.popoverTarget !== undefined;

export interface PopoverContentProps extends ParentProps {
  class?: string;
  arrow?: boolean;
}

export const PopoverContent = (props: PopoverContentProps) => (
  <Portal>
    <div data-popover-content data-popover-unset class={props.class}>
      {props.children}
      <Show when={props.arrow}>
        <PopoverArrow />
      </Show>
    </div>
  </Portal>
);
PopoverContent.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.popoverContent !== undefined;
