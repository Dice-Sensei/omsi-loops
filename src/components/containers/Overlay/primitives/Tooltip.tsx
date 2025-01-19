import { createEffect, createSignal, createUniqueId, mergeProps, onCleanup, ParentProps } from 'solid-js';
import { Placement } from '@floating-ui/dom';
import { useOverlay } from '../createOverlay.ts';
import { Overlay } from '../Overlay.tsx';
import { OverlayContentProps } from '../Overlay.components.tsx';
import cx from 'clsx';

interface TooltipProps extends ParentProps {
  id?: string;
  disabled?: boolean;
  placement?: Placement;
  visible?: boolean;
}

export const Tooltip = (props: TooltipProps) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId(), placement: 'bottom' }, props);
  const [isVisible, toggleVisible] = createSignal($?.visible ?? false);
  const [isAnchored, toggleAnchor] = createSignal(false);
  const overlay = useOverlay($.id);

  createEffect(() => {
    const state = overlay();
    if (!state) return;
    const visible = isVisible();
    const anchored = isAnchored();
    if ($.disabled) return;

    if (visible || anchored) {
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
      toggleVisible($.visible ?? isHover);
    },
  );

  createEffect(() => {
    const state = overlay();
    if (!state) return;

    let timeoutId: number;
    let startTime: number;
    let animationFrameId: number;

    const progress = document.createElement('div');
    progress.className = 'absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-transparent';
    state.content.appendChild(progress);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / 800) * 100, 100);

      progress.style.background = `conic-gradient(rgb(59 130 246) ${percent}%, transparent ${percent}%)`;

      if (percent < 99) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        progress.style.background = '';
        progress.classList.remove('bg-transparent', 'border-blue-500', 'w-4', 'h-4');
        progress.classList.add('bg-red-500', 'border-red-500', 'w-2', 'h-2');
      }
    };

    const onMouseEnter = () => {
      if (isAnchored()) return;

      progress.classList.remove('bg-red-500', 'border-red-500', 'w-2', 'h-2');
      progress.classList.add('bg-transparent', 'border-blue-500', 'w-4', 'h-4');

      startTime = Date.now();
      updateProgress();

      timeoutId = setTimeout(() => {
        toggleAnchor(true);
        cancelAnimationFrame(animationFrameId);

        state.content.addEventListener('click', onClick);
        state.target.removeEventListener('mouseleave', onMouseLeave);
      }, 800);

      state.target.addEventListener('mouseleave', onMouseLeave);
    };

    const onMouseLeave = () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      state.target.removeEventListener('mouseleave', onMouseLeave);
    };

    const onClick = () => {
      toggleAnchor(false);
      state.content.removeEventListener('click', onClick);
    };

    state.target.addEventListener('mouseenter', onMouseEnter);

    onCleanup(() => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      state.target.removeEventListener('mouseenter', onMouseEnter);
      state.target.removeEventListener('mouseleave', onMouseLeave);
      state.content.removeEventListener('click', onClick);
    });
  });

  return (
    <Overlay id={$.id} placement={$.placement}>
      {$.children}
    </Overlay>
  );
};

Tooltip.Target = Overlay.Target;
Tooltip.Content = (props: OverlayContentProps) => (
  <Overlay.Content class={cx('bg-slate-500 border border-neutral-500 px-2', props.class)}>
    {props.children}
  </Overlay.Content>
);
