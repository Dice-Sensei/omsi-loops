import { createUniqueId, mergeProps, onCleanup, onMount, ParentProps } from 'solid-js';
import { Overlay, OverlayProps } from '../Overlay.tsx';
import { selectOverlay } from '../createOverlay.ts';
import { OverlayContentProps, OverlayTriggerProps } from '../Overlay.components.tsx';
import cx from 'clsx';
import { ButtonIcon } from '../../../buttons/Button/ButtonIcon.tsx';
import { createContext } from '../../../../signals/createContext.tsx';

const [usePopover, PopoverProvider] = createContext(() => {
  const overlay = selectOverlay();

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.stopImmediatePropagation();
    close();
  };

  const handleDismiss = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    if (overlay().contentRef.active.contains(event.target as Node)) return;
    close();
  };

  const open = () => {
    const o = overlay();
    o.toggleShown(true);
    document.addEventListener('click', handleDismiss);
    document.addEventListener('keydown', handleEscape);
    o.contentRef.active.focus();
  };

  const close = () => {
    overlay().toggleShown(false);
    cleanup();
    overlay().triggerRef.active.focus();
  };

  const toggle = (event: Event) => {
    event.stopImmediatePropagation();
    if (!overlay().isShown()) open();
    else close();
  };

  const cleanup = () => {
    document.removeEventListener('click', handleDismiss);
    document.removeEventListener('keydown', handleEscape);
  };

  return { overlay, open, close, toggle, cleanup };
});

const Content = (props: ParentProps) => {
  const { overlay, toggle, cleanup } = usePopover();

  onMount(() => {
    overlay().triggerRef.active.addEventListener('click', toggle);
  });
  onCleanup(() => {
    cleanup();
    overlay().triggerRef.active.removeEventListener('click', toggle);
  });

  return <>{props.children}</>;
};

interface PopoverProps extends OverlayProps {
}

export const Popover = (props: ParentProps<PopoverProps>) => {
  const $ = mergeProps({ placement: 'right' as const }, props);

  return (
    <Overlay id={$.id} placement={$.placement}>
      <PopoverProvider>
        <Content>{$.children}</Content>
      </PopoverProvider>
    </Overlay>
  );
};

Popover.Trigger = (props: OverlayTriggerProps) => <Overlay.Trigger {...props} tabIndex={-1} />;
Popover.Content = (props: OverlayContentProps) => (
  <Overlay.Content
    {...props}
    tabIndex={-1}
    class={cx('relative bg-neutral-50 border border-neutral-500 rounded-sm max-h-[95dvh]', props.class)}
  >
    <PopoverCloseButton />
    <div class='overflow-auto px-4 py-3 max-h-[95dvh]'>{props.children}</div>
  </Overlay.Content>
);

const PopoverCloseButton = () => {
  const { close } = usePopover();

  return (
    <ButtonIcon
      class='absolute top-1 right-1'
      name='close'
      onClick={(event) => {
        event.stopImmediatePropagation();
        close();
      }}
    />
  );
};
