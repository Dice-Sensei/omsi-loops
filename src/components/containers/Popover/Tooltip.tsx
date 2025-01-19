import { createEffect, createSignal, createUniqueId, mergeProps, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { usePopover } from './createPopover.ts';
import { Popover } from './Popover.tsx';

interface TooltipProps extends ParentProps {
  id?: string;
  disabled?: boolean;
  placement?: Placement;
  visible?: boolean;
}

export const Tooltip = (props: TooltipProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'bottom' }, props);
  const [isVisible, setIsVisible] = createSignal($?.visible ?? false);
  const popover = usePopover($.id);

  createEffect(() => {
    const state = popover();
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
      const state = popover();
      if (!state) return;
      const isHover = state.isHover();
      setIsVisible($.visible ?? isHover);
    },
  );

  return (
    <Popover id={$.id} placement={$.placement}>
      {$.children}
    </Popover>
  );
};
