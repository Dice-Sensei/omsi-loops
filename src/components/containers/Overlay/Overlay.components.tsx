import cx from 'clsx';
import { ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface OverlayArrowProps {
  class?: string;
}

const OverlayArrow = (props: OverlayArrowProps) => (
  // <div data-overlay-arrow class={cx('absolute', props.class)}>
  //   <svg width='12' height='6' viewBox='0 0 12 6'>
  //     <path
  //       d='M1 8L8 1L15 8'
  //       class='fill-slate-800 stroke-amber-800 stroke-1'
  //     />
  //   </svg>
  // </div>
  <div data-overlay-arrow class={cx('absolute', props.class)}>
    <div
      class={cx(
        'w-[8px] h-[8px]',
        'rotate-45',
        'bg-slate-900 border border-amber-800',
        // clip into triangle shape - only show top-left half of the square
        '[clip-path:polygon(0%_0%,_100%_0%,_0%_100%)]',
        // add this to force pixel snapping
        'transform-gpu',
      )}
    />
  </div>
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
