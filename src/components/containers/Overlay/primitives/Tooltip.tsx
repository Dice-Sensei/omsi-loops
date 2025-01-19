import { createEffect, createSignal, createUniqueId, mergeProps, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { useOverlay } from '../createOverlay.ts';
import { Overlay } from '../Overlay.tsx';

interface TooltipProps extends ParentProps {
  id?: string;
  disabled?: boolean;
  placement?: Placement;
  visible?: boolean;
}

export const Tooltip = (props: TooltipProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'bottom' }, props);
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

  createEffect(
    () => {
      if ($.disabled) return;
      const state = overlay();
      if (!state) return;
      const isHover = state.isHover();
      setIsVisible($.visible ?? isHover);
    },
  );

  createEffect(() => {
    const state = overlay();
    if (!state) return;
  });

  return (
    <Overlay id={$.id} placement={$.placement}>
      {$.children}
    </Overlay>
  );
};
