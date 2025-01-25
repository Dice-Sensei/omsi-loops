import { createEffect, createSignal, createUniqueId, mergeProps, onCleanup, onMount, ParentProps } from 'solid-js';
import { Overlay, OverlayProps } from '../Overlay.tsx';
import { selectOverlay } from '../createOverlay.ts';
import { OverlayContentProps, OverlayTriggerProps } from '../Overlay.components.tsx';
import cx from 'clsx';
import { createContext } from '../../../../signals/createContext.tsx';
import s from './Tooltip.module.css';
import { autoUpdate } from '@floating-ui/dom';

export interface TooltipProps extends OverlayProps {
}

const [useTooltip, TooltipProvider] = createContext(() => {
  const [isHover, toggleHover] = createSignal(false);
  const [isFocus, toggleFocus] = createSignal(false);
  const [isAnchored, toggleAnchor] = createSignal(false);

  const overlay = selectOverlay();

  return { overlay, isAnchored, toggleAnchor, isHover, toggleHover, isFocus, toggleFocus };
});

export const Tooltip = (props: ParentProps<TooltipProps>) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'right' as const }, props);

  return (
    <Overlay id={$.id} placement={$.placement}>
      <TooltipProvider>
        {$.children}
      </TooltipProvider>
    </Overlay>
  );
};

Tooltip.Trigger = (props: OverlayTriggerProps) => {
  const { overlay, toggleFocus, toggleHover, isAnchored, isFocus, isHover } = useTooltip();

  createEffect(() => overlay().toggleShown(isHover() || isFocus() || isAnchored()));

  onMount(() => {
    const { triggerRef: { active: trigger } } = overlay();
    trigger.addEventListener('pointerover', () => toggleHover(true));
    trigger.addEventListener('pointerleave', () => toggleHover(false));
    trigger.addEventListener('focus', () => toggleFocus(true));
    trigger.addEventListener('blur', () => toggleFocus(false));
  });

  return <Overlay.Trigger {...props} class={cx('cursor-help', props.class)} />;
};

const Content = (props: OverlayContentProps) => {
  const { overlay } = useTooltip();

  onMount(() => {
    const { triggerRef, contentRef, update } = overlay();

    onCleanup(autoUpdate(triggerRef.active, contentRef.active, update));
  });

  return <div class='overflow-auto px-2 max-h-[calc(95dvh-2rem)]'>{props.children}</div>;
};

Tooltip.Content = (props: OverlayContentProps) => (
  <Overlay.Content
    {...props}
    class={cx('bg-neutral-50 border border-neutral-500 rounded-sm max-w-80 max-h-[95dvh]', props.class)}
  >
    <Content>{props.children}</Content>
    <ProgressCircle />
  </Overlay.Content>
);

const ProgressCircle = () => {
  const { overlay, isAnchored, toggleAnchor } = useTooltip();
  let hoverTimeoutId: number;
  const attachDismiss = () => overlay().contentRef.active.addEventListener('click', disableAnchor, { once: true });
  const detachDismiss = () => overlay().contentRef.active.removeEventListener('click', disableAnchor);

  const enableAnchor = () => {
    toggleAnchor(true);
    attachDismiss();
  };
  const disableAnchor = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    toggleAnchor(false);
  };

  onMount(() => {
    hoverTimeoutId = setTimeout(enableAnchor, 1000);
  });

  onCleanup(() => {
    clearTimeout(hoverTimeoutId);
    detachDismiss();
  });

  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      class={cx(
        'absolute rounded-full top-0.5 right-0.5',
        isAnchored() ? 'bg-red-500 border-red-600 w-2 h-2' : s.circularProgress + ' border-blue-600 w-3 h-3',
      )}
    >
      <circle class={s.bg} />
      <circle class={s.fg} />
    </svg>
  );
};
