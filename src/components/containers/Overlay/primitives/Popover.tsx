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

interface PopoverProps extends ParentProps {
  id?: string;
  placement?: Placement;
  disabled?: boolean;
  nodismiss?: boolean;
  open?: boolean;
  visible?: boolean;
}

interface VisibilityEffectProps {
  overlay: Accessor<OverlayState | undefined>;
  isVisible: Accessor<boolean>;
  disabled?: boolean;
}

const createVisibilityEffect = (props: VisibilityEffectProps) =>
  createEffect(() => {
    const state = props.overlay();
    if (!state) return;
    const visible = props.isVisible();
    if (props.disabled) return;

    if (visible) {
      state.show();
    } else {
      state.hide();
    }
  });

interface ClickListenersProps {
  disabled?: boolean;
  overlay: Accessor<OverlayState | undefined>;
  isVisible: Accessor<boolean>;
  toggleVisible: Setter<boolean>;
  nodismiss?: boolean;
}

const createClickListeners = (props: ClickListenersProps) =>
  createEffect(() => {
    if (props.disabled) return;
    const state = props.overlay();
    if (!state) return;

    const handleDismiss = (event: MouseEvent) => {
      if (!state || state.content.contains(event.target as Node)) return;
      props.toggleVisible(false);
    };

    const handleClick = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      const next = !props.isVisible();
      props.toggleVisible(next);

      if (props.nodismiss || !next) {
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

export const Popover = (props: PopoverProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'right' as const }, props);
  const [isVisible, toggleVisible] = createSignal($?.visible ?? false);
  const overlay = useOverlay($.id);

  createVisibilityEffect({ isVisible, overlay, disabled: $.disabled });
  createClickListeners({ isVisible, toggleVisible, overlay, disabled: $.disabled, nodismiss: $.nodismiss });

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
