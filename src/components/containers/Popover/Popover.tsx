import { children as resolveChildren, onMount, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { PopoverArrow, PopoverContent, PopoverTarget } from './Popover.components.tsx';
import { createPopover } from './createPopover.ts';

export interface PopoverProps {
  id: string;
  placement?: Placement;
  useArrow?: boolean;
}

export const Popover = (props: ParentProps<PopoverProps>) => {
  const activate = createPopover(props);

  const children = resolveChildren(() => props.children);

  onMount(() => {
    const resolved = children();
    console.log({ resolved });

    if (!Array.isArray(resolved)) return;
    const target = resolved.find(PopoverTarget.is) as HTMLElement;

    const content = document.querySelector('[data-popover-unset]') as HTMLElement;
    content.removeAttribute('data-popover-unset');

    const arrow = PopoverArrow.is(content.lastElementChild) ? content.lastElementChild : undefined;

    activate({ id: props.id, target, content, arrow });
  });

  return children();
};

Popover.Target = PopoverTarget;
Popover.Content = PopoverContent;
Popover.Arrow = PopoverArrow;
