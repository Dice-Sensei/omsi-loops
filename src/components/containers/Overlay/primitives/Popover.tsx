import { createEffect, createSignal, createUniqueId, mergeProps, onCleanup, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { useOverlay } from '../createOverlay.ts';
import { Overlay } from '../Overlay.tsx';
import { OverlayContentProps } from '../Overlay.components.tsx';
import cx from 'clsx';

interface PopoverProps extends ParentProps {
  id?: string;
  placement?: Placement;
  disabled?: boolean;
  open?: boolean;
}

export const Popover = (props: PopoverProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'right' }, props);
  const [isVisible, setIsVisible] = createSignal($?.visible ?? false);
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

  const onClick = () => setIsVisible((v) => !v);

  createEffect(
    () => {
      if ($.disabled) return;
      const state = overlay();
      if (!state) return;
      const target = state.target;
      target.addEventListener('click', onClick);
      onCleanup(() => target.removeEventListener('click', onClick));
    },
  );

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
