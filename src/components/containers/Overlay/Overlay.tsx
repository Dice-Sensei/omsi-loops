import { children as resolveChildren, onMount, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { OverlayArrow, OverlayContent, OverlayTarget } from './Overlay.components.tsx';
import { createOverlay } from './createOverlay.ts';

export interface OverlayProps {
  id: string;
  placement?: Placement;
  useArrow?: boolean;
}

export const Overlay = (props: ParentProps<OverlayProps>) => {
  const activate = createOverlay(props);

  const children = resolveChildren(() => props.children);

  onMount(() => {
    const resolved = children();
    console.log({ resolved });

    if (!Array.isArray(resolved)) return;
    const target = resolved.find(OverlayTarget.is) as HTMLElement;

    const content = document.querySelector('[data-overlay-unset]') as HTMLElement;
    content.removeAttribute('data-overlay-unset');

    const arrow = OverlayArrow.is(content.lastElementChild) ? content.lastElementChild : undefined;

    activate({ id: props.id, target, content, arrow });
  });

  return children();
};

Overlay.Target = OverlayTarget;
Overlay.Content = OverlayContent;
Overlay.Arrow = OverlayArrow;
