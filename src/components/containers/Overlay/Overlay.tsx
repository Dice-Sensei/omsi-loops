import { createRenderEffect, createUniqueId, mergeProps, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { OverlayContent, OverlayTrigger } from './Overlay.components.tsx';
import { createOverlay } from './createOverlay.ts';
import { OverlayIdProvider } from './Overlay.context.tsx';

export interface OverlayProps {
  id?: string;
  placement?: Placement;
}

export const Overlay = (props: ParentProps<OverlayProps>) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId() }, props);
  createRenderEffect(() => createOverlay($));

  return <OverlayIdProvider id={$.id}>{$.children}</OverlayIdProvider>;
};

Overlay.Trigger = OverlayTrigger;
Overlay.Content = OverlayContent;
