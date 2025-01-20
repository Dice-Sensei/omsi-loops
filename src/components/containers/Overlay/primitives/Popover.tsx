import {
  Accessor,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  ParentProps,
  Setter,
} from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { OverlayState, useOverlay } from '../createOverlay.ts';
import { Overlay } from '../Overlay.tsx';
import { OverlayContentProps } from '../Overlay.components.tsx';
import cx from 'clsx';

const createVisibilityEffect = (state: PopoverState) =>
  createEffect(() => {
    const overlay = state.overlay();
    if (!overlay) return;
    const visible = state.isVisible();
    if (state.disabled()) return;

    if (visible) {
      overlay.show();
    } else {
      overlay.hide();
    }
  });

const createPointerEffect = (state: PopoverState) =>
  createEffect(() => {
    if (state.disabled()) return;
    const overlay = state.overlay();
    if (!overlay) return;

    const handleDismiss = (event: MouseEvent) => {
      if (!overlay || overlay.content.contains(event.target as Node)) return;
      state.toggleVisible(false);
    };

    const handleClick = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      const next = !state.isVisible();
      state.toggleVisible(next);

      if (state.nodismiss() || !next) {
        document.removeEventListener('click', handleDismiss);
      } else {
        document.addEventListener('click', handleDismiss);
      }
    };

    overlay.target.addEventListener('click', handleClick);
    onCleanup(() => {
      overlay.target.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleDismiss);
    });
  });

interface PopoverState {
  isVisible: Accessor<boolean>;
  toggleVisible: Setter<boolean>;
  overlay: Accessor<OverlayState | undefined>;
  disabled: Accessor<boolean | undefined>;
  nodismiss: Accessor<boolean | undefined>;
}

const createPopoverState = (props: PopoverProps & { id: string }): PopoverState => {
  const [isVisible, toggleVisible] = createSignal(props.open ?? false);
  const overlay = useOverlay(props.id);

  return {
    isVisible,
    toggleVisible,
    overlay,
    disabled: () => props.disabled,
    nodismiss: () => props.nodismiss,
  };
};

interface PopoverProps extends ParentProps {
  id?: string;
  placement?: Placement;
  disabled?: boolean;
  nodismiss?: boolean;
  open?: boolean;
  visible?: boolean;
}

export const Popover = (props: PopoverProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'right' as const }, props);
  const state = createPopoverState($);
  createVisibilityEffect(state);
  createPointerEffect(state);

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
