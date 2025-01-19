import { children, createEffect, createMemo, createSignal, createUniqueId, mergeProps, ParentProps } from 'solid-js';
import cx from 'clsx';
import { createContext } from '../../../signals/createContext.tsx';
import { chdir } from 'node:process';

type Placement = 'top' | 'right' | 'bottom' | 'left' | 'auto';
type Align = 'start' | 'center' | 'end';
type Position = `${Placement}-${Align}`;

export interface PopoverProps {
  position?: Position;
  show?: boolean;
  id?: string;
  class?: string;
  dismissable?: boolean;
}

const [usePopover, PopoverProvider] = createContext((props: PopoverProps) => {
  const [show, setShow] = createSignal(props.show);

  return { show, setShow, id: props.id, dismissable: props.dismissable };
});

export const Popover = (props: ParentProps<PopoverProps>) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), position: 'right-center', dismissable: false }, props);

  return (
    <PopoverProvider value={$.id}>
      {$.children}
    </PopoverProvider>
  );
};

const PopoverTarget = (props: ParentProps<PopoverProps>) => {
  return <div data-popover-target>{props.children}</div>;
};

const PopoverContent = (props: ParentProps<PopoverProps>) => {
  return <div data-popover-content>{props.children}</div>;
};
PopoverContent.is = (child: any) =>
  !!child && child instanceof HTMLDivElement && child.dataset.popoverContent !== undefined;

Popover.Target = PopoverTarget;
Popover.Content = PopoverContent;
