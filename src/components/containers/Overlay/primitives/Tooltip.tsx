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
import { OverlayContentProps, OverlayTargetProps } from '../Overlay.components.tsx';
import cx from 'clsx';

interface TooltipProps extends ParentProps {
  id?: string;
  disabled?: boolean;
  placement?: Placement;
  visible?: boolean;
}

interface TooltipState {
  isVisible: Accessor<boolean>;
  toggleVisible: Setter<boolean>;
  isAnchored: Accessor<boolean>;
  toggleAnchor: Setter<boolean>;
  overlay: Accessor<OverlayState | undefined>;
  visible: Accessor<boolean | undefined>;
  disabled: Accessor<boolean | undefined>;
}

const createTooltipState = (props: TooltipProps & { id: string }): TooltipState => {
  const [isVisible, toggleVisible] = createSignal(props.visible ?? false);
  const [isAnchored, toggleAnchor] = createSignal(false);
  const overlay = useOverlay(props.id);

  return {
    isVisible,
    toggleVisible,
    isAnchored,
    toggleAnchor,
    overlay,
    visible: () => props.visible,
    disabled: () => props.disabled,
  };
};

const createVisibilityEffect = (state: TooltipState) =>
  createEffect(() => {
    const overlay = state.overlay();
    if (!overlay) return;
    const visible = state.isVisible();
    const anchored = state.isAnchored();
    if (state.disabled()) return;

    if (visible || anchored) {
      overlay.show();
    } else {
      overlay.hide();
    }
  });

const createHoverEffect = (state: TooltipState) =>
  createEffect(() => {
    if (state.disabled()) return;
    const overlay = state.overlay();
    if (!overlay) return;
    const isHover = overlay.isHover();
    state.toggleVisible(state.visible() ?? isHover);
  });

const createPointerEffect = (state: TooltipState) =>
  createEffect(() => {
    const overlay = state.overlay();
    if (!overlay) return;

    let timeoutId: number;
    let startTime: number;
    let animationFrameId: number;

    const progress = document.createElement('div');
    progress.className = 'absolute top-0.5 right-0.5 rounded-full border-2 opacity-50';
    overlay.content.appendChild(progress);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / 800) * 100, 100);

      progress.style.background = `conic-gradient(rgb(59 130 246) ${percent}%, transparent ${percent}%)`;

      if (percent < 99) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        progress.style.background = '';
        progress.classList.remove('bg-transparent', 'border-blue-600', 'w-3', 'h-3');
        progress.classList.add('bg-red-500', 'border-red-600', 'w-2', 'h-2');
      }
    };

    const onMouseEnter = () => {
      if (state.isAnchored()) return;

      progress.classList.remove('bg-red-500', 'border-red-600', 'w-2', 'h-2');
      progress.classList.add('bg-transparent', 'border-blue-600', 'w-3', 'h-3');

      startTime = Date.now();
      updateProgress();

      timeoutId = setTimeout(() => {
        state.toggleAnchor(true);
        cancelAnimationFrame(animationFrameId);

        overlay.content.addEventListener('click', onClick);
        overlay.target.removeEventListener('mouseleave', onMouseLeave);
      }, 800);

      overlay.target.addEventListener('mouseleave', onMouseLeave);
    };

    const onMouseLeave = () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      overlay.target.removeEventListener('mouseleave', onMouseLeave);
    };

    const onClick = (event: MouseEvent) => {
      event.stopPropagation();
      state.toggleAnchor(false);
      overlay.content.removeEventListener('click', onClick);
    };

    overlay.target.addEventListener('mouseenter', onMouseEnter);

    onCleanup(() => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      overlay.target.removeEventListener('mouseenter', onMouseEnter);
      overlay.target.removeEventListener('mouseleave', onMouseLeave);
      overlay.content.removeEventListener('click', onClick);
    });
  });

export const Tooltip = (props: TooltipProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'bottom' as const }, props);

  const state = createTooltipState($);
  createVisibilityEffect(state);
  createPointerEffect(state);
  createHoverEffect(state);

  return (
    <Overlay id={$.id} placement={$.placement}>
      {$.children}
    </Overlay>
  );
};

Tooltip.Target = (props: OverlayTargetProps) => (
  <Overlay.Target class={cx('cursor-help', props.class)}>{props.children}</Overlay.Target>
);
Tooltip.Content = (props: OverlayContentProps) => (
  <Overlay.Content class={cx('bg-neutral-50 border border-neutral-500 px-2 rounded-sm max-w-80', props.class)}>
    {props.children}
  </Overlay.Content>
);
