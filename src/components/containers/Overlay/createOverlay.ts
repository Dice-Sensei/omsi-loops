import { Accessor, createMemo, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { arrow, autoUpdate, computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';
import { onCleanup } from 'solid-js';
import { createRef } from '../../../signals/createRef.ts';
import { PlacementNs } from './placement.ns.ts';

export interface CreateOverlayOptions {
  placement?: Placement;
  useHover?: boolean;
  useFocus?: boolean;
}

export interface OverlayState {
  isHover: Accessor<boolean>;
  isFocus: Accessor<boolean>;
  isShown: Accessor<boolean>;
  show: () => void;
  hide: () => void;
  target: HTMLElement;
  content: HTMLElement;
}

export interface ActivateOptions {
  id: string;
  target: HTMLElement;
  content: HTMLElement;
  arrow?: HTMLElement;
}
export type ActivateOverlay = (props: ActivateOptions) => void;
export const createOverlay = (props: CreateOverlayOptions): ActivateOverlay => {
  const [isHover, toggleHover] = createSignal(false);
  const [isFocus, toggleFocus] = createSignal(false);
  const [isShown, toggleShown] = createSignal(false);
  const contentRef = createRef<HTMLElement>();
  const targetRef = createRef<HTMLElement>();
  const arrowRef = createRef<HTMLElement>();

  const update = async () => {
    const useArrow = !!arrowRef.active;

    const { x, y, placement, strategy, middlewareData } = await computePosition(targetRef.active, contentRef.active, {
      placement: props?.placement ?? 'right',
      strategy: 'fixed',
      middleware: [
        flip(),
        shift({ padding: 8 }),
        offset({ crossAxis: 0, mainAxis: 8 }),
        useArrow && arrow({ element: arrowRef.active }),
      ],
    });

    contentRef.active.style.setProperty('position', strategy);
    contentRef.active.style.setProperty('left', `${x}px`);
    contentRef.active.style.setProperty('top', `${y}px`);

    if (useArrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow!;
      const side = PlacementNs.toSide(placement);

      if (side === 'left') {
        arrowRef.active.style.setProperty('transform', `rotate(270deg)`);
      } else if (side === 'right') {
        arrowRef.active.style.setProperty('transform', `rotate(90deg)`);
      } else if (side === 'top') {
        arrowRef.active.style.setProperty('transform', `rotate(0deg)`);
      } else if (side === 'bottom') {
        arrowRef.active.style.setProperty('transform', `rotate(180deg)`);
      }

      arrowRef.active.style.setProperty('left', arrowX != null ? `${arrowX}px` : '');
      arrowRef.active.style.setProperty('top', arrowY != null ? `${arrowY}px` : '');
      arrowRef.active.style.setProperty('right', '');
      arrowRef.active.style.setProperty('bottom', '');
      arrowRef.active.style.setProperty(side, '-4px');
    }
  };

  const show = () => {
    if (isShown()) return;
    toggleShown(true);
    contentRef.active.style.setProperty('display', 'block');
    update();
  };

  const hide = () => {
    if (!isShown()) return;
    toggleShown(false);
    contentRef.active.style.setProperty('display', 'none');
  };

  return (props) => {
    targetRef(props.target);
    contentRef(props.content);
    if (props.arrow) arrowRef(props.arrow);

    contentRef.active.style.setProperty('display', 'none');
    targetRef.active.addEventListener('mouseenter', () => toggleHover(true));
    targetRef.active.addEventListener('mouseleave', () => toggleHover(false));
    targetRef.active.addEventListener('focus', () => toggleFocus(true));
    targetRef.active.addEventListener('blur', () => toggleFocus(false));

    if (OverlayStore[props.id]) throw new Error(`Overlay with id '${props.id}' already exists`);
    setOverlayStore(props.id, {
      isHover,
      isFocus,
      isShown,
      show,
      hide,
      target: targetRef.active,
      content: contentRef.active,
    });

    const cleanup = autoUpdate(targetRef.active, contentRef.active, update);
    onCleanup(() => {
      cleanup();
      setOverlayStore(props.id, undefined!);
    });
  };
};

export const [OverlayStore, setOverlayStore] = createStore<Record<string, OverlayState>>({});
export const useOverlay = (id: string): Accessor<OverlayState | undefined> => createMemo(() => OverlayStore[id]);
