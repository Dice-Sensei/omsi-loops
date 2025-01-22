import cx from 'clsx';
import { ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface OverlayArrowProps {
  class?: string;
}

const OverlayArrow = (props: OverlayArrowProps) => (
  <div
    data-overlay-arrow
    class='
    absolute
    w-2 h-2
    border bg-neutral-50 border-neutral-500 
    [clip-path:polygon(0%_0%,_100%_0%,_0%_100%)]
    '
  />
);
OverlayArrow.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.overlayArrow !== undefined;

export interface OverlayTargetProps extends ParentProps {
  class?: string;
}

export const OverlayTarget = (props: OverlayTargetProps) => (
  <div data-overlay-target class={props.class}>{props.children}</div>
);
OverlayTarget.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.overlayTarget !== undefined;

export interface OverlayContentProps extends ParentProps {
  class?: string;
}

export const OverlayContent = (props: OverlayContentProps) => (
  <Portal>
    <div data-overlay-content data-overlay-unset class={props.class}>
      {props.children}
      <OverlayArrow />
    </div>
  </Portal>
);
OverlayContent.is = (child: any): child is HTMLDivElement =>
  !!child && child instanceof HTMLDivElement && child.dataset.overlayContent !== undefined;
