import { Accessor, createEffect, createMemo, createSignal, onCleanup, Setter } from 'solid-js';
import { createStore } from 'solid-js/store';
import { arrow, computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';
import { createRef, Reference } from '../../../signals/createRef.ts';
import { PlacementNs } from './placement.ns.ts';
import { useOverlayId } from './Overlay.context.tsx';

export interface OverlayOptions {
  placement?: Placement;
  useHover?: boolean;
  useFocus?: boolean;
  id: string;
}

export interface OverlayState {
  isShown: Accessor<boolean>;
  toggleShown: Setter<boolean>;
  update: () => Promise<void>;
  contentRef: Reference<HTMLElement>;
  triggerRef: Reference<HTMLElement>;
  arrowRef: Reference<HTMLElement>;
  id: string;
}

export const createOverlay = (options: OverlayOptions) => {
  const [isShown, toggleShown] = createSignal(false);
  const contentRef = createRef<HTMLElement>();
  const triggerRef = createRef<HTMLElement>();
  const arrowRef = createRef<HTMLElement>();

  const update = async () => {
    if (!triggerRef.active || !contentRef.active) return;
    const useArrow = !!arrowRef.active;

    const { x, y, placement, strategy, middlewareData } = await computePosition(triggerRef.active, contentRef.active, {
      placement: options?.placement ?? 'right',
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
        arrowRef.active.style.setProperty('transform', `rotate(315deg)`);
      } else if (side === 'right') {
        arrowRef.active.style.setProperty('transform', `rotate(135deg)`);
      } else if (side === 'top') {
        arrowRef.active.style.setProperty('transform', `rotate(45deg)`);
      } else if (side === 'bottom') {
        arrowRef.active.style.setProperty('transform', `rotate(225deg)`);
      }

      arrowRef.active.style.setProperty('left', arrowX != null ? `${arrowX}px` : '');
      arrowRef.active.style.setProperty('top', arrowY != null ? `${arrowY}px` : '');
      arrowRef.active.style.setProperty('right', '');
      arrowRef.active.style.setProperty('bottom', '');
      arrowRef.active.style.setProperty(side, '-4px');
    }
  };

  createEffect(() => {
    if (isShown()) update();
  });

  setOverlayStore(options.id, {
    isShown,
    toggleShown,
    update,
    arrowRef,
    triggerRef,
    contentRef,
    id: options.id,
  });

  onCleanup(() => removeOverlay(options));
};

export const removeOverlay = (options: OverlayOptions) => setOverlayStore(options.id, undefined!);

export const [OverlayStore, setOverlayStore] = createStore<Record<string, OverlayState>>({});
export const selectOverlay = (id: string = useOverlayId()): Accessor<OverlayState> =>
  createMemo(() => OverlayStore[id]);
