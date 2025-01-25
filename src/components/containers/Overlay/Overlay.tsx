import { createRenderEffect, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { OverlayContent, OverlayTrigger } from './Overlay.components.tsx';
import { createOverlay } from './createOverlay.ts';
import { OverlayIdProvider } from './Overlay.context.tsx';

export interface OverlayProps {
  id: string;
  placement?: Placement;
}

export const Overlay = (props: ParentProps<OverlayProps>) => {
  createRenderEffect(() => createOverlay(props));

  return <OverlayIdProvider id={props.id}>{props.children}</OverlayIdProvider>;
};

Overlay.Trigger = OverlayTrigger;
Overlay.Content = OverlayContent;
