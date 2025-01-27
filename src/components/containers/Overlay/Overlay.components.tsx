import cx from 'clsx';
import { JSX, ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { selectOverlay } from './createOverlay.ts';

interface OverlayArrowProps {
  class?: string;
}

const OverlayArrow = (props: OverlayArrowProps) => {
  const overlay = selectOverlay();

  return (
    <div
      ref={overlay().arrowRef}
      class={cx(
        `
    absolute
    w-2 h-2
    border bg-neutral-50 border-neutral-500 
    [clip-path:polygon(0%_0%,_100%_0%,_0%_100%)]
    `,
        props.class,
      )}
    />
  );
};

export interface OverlayTriggerProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  class?: string;
}

export const OverlayTrigger = (props: OverlayTriggerProps) => {
  const overlay = selectOverlay();

  return (
    <div ref={overlay().triggerRef} class={props.class}>
      {props.children}
    </div>
  );
};

export interface OverlayContentProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  class?: string;
}

const overlays = document.getElementById('overlays')!;
export const OverlayContent = (props: OverlayContentProps) => {
  const overlay = selectOverlay();

  return (
    <Show when={overlay().isShown()}>
      <Portal mount={overlays}>
        <div ref={overlay().contentRef} {...props} id={overlay().id}>
          {props.children}
          <OverlayArrow />
        </div>
      </Portal>
    </Show>
  );
};
