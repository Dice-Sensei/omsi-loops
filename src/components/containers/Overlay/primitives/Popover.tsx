import { createEffect, createSignal, createUniqueId, mergeProps, onCleanup, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { OverlayState, useOverlay } from '../createOverlay.ts';
import { Overlay } from '../Overlay.tsx';
import { OverlayContentProps } from '../Overlay.components.tsx';
import cx from 'clsx';

interface PopoverProps extends ParentProps {
  id?: string;
  placement?: Placement;
  disabled?: boolean;
  nodismiss?: boolean;
  open?: boolean;
  visible?: boolean;
}

interface VisibilityEffectProps {
  overlay: OverlayState;
  isVisible?: boolean;
  disabled?: boolean;
}

export const Popover = (props: PopoverProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'right' as const }, props);
  const [isVisible, toggleVisible] = createSignal($?.visible ?? false);
  const overlay = useOverlay($.id);

  createEffect(() => {
    const state = overlay();
    if (!state) return;
    const visible = isVisible();
    if ($.disabled) return;

    if (visible) {
      state.show();
    } else {
      state.hide();
    }
  });

  createEffect(() => {
    if ($.disabled) return;
    const state = overlay();
    if (!state) return;

    const handleDismiss = (event: MouseEvent) => {
      if (!state || state.content.contains(event.target as Node)) return;
      toggleVisible(false);
    };

    const handleClick = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      const next = !isVisible();
      toggleVisible(next);

      if ($.nodismiss || !next) {
        document.removeEventListener('click', handleDismiss);
      } else {
        document.addEventListener('click', handleDismiss);
      }
    };

    state.target.addEventListener('click', handleClick);
    onCleanup(() => {
      state.target.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleDismiss);
    });
  });

  return (
    <Overlay id={$.id} placement={$.placement}>
      {$.children}
    </Overlay>
  );
};

Popover.Target = Overlay.Target;
Popover.Content = (props: OverlayContentProps) => (
  <Overlay.Content class={cx('bg-slate-500 border border-neutral-500 px-2', props.class)}>
    {props.children}
  </Overlay.Content>
);
