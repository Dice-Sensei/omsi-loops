import { Accessor, createMemo, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { arrow, autoUpdate, computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';
import { onCleanup } from 'solid-js';
import { createRef } from '../../../signals/createRef.ts';
import { PlacementNs } from './placement.ns.ts';

export interface CreatePopoverOptions {
  placement?: Placement;
  useHover?: boolean;
  useFocus?: boolean;
}

export interface PopoverState {
  isHover: Accessor<boolean>;
  isFocus: Accessor<boolean>;
  isShown: Accessor<boolean>;
  show: () => void;
  hide: () => void;
}

export interface ActivateOptions {
  id: string;
  target: HTMLElement;
  content: HTMLElement;
  arrow?: HTMLElement;
}
export type ActivatePopover = (props: ActivateOptions) => void;
export const createPopover = (props: CreatePopoverOptions): ActivatePopover => {
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
        offset({ crossAxis: 8, mainAxis: 8 }),
        useArrow && arrow({ element: arrowRef.active }),
      ],
    });

    contentRef.active.style.setProperty('position', strategy);
    contentRef.active.style.setProperty('left', `${x}px`);
    contentRef.active.style.setProperty('top', `${y}px`);

    if (useArrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow!;
      const side = PlacementNs.toSide(placement);

      arrowRef.active.style.setProperty('left', `${arrowX}px`);
      arrowRef.active.style.setProperty('top', `${arrowY}px`);
      arrowRef.active.style.setProperty('transform', `rotate(45deg)`);
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

    setPopoverStore(props.id, { isHover, isFocus, isShown, show, hide });
    const cleanup = autoUpdate(targetRef.active, contentRef.active, update);

    onCleanup(() => {
      cleanup();
      setPopoverStore(props.id, undefined!);
    });
  };
};

export const [PopoverStore, setPopoverStore] = createStore<Record<string, PopoverState>>({});
export const usePopover = (id: string): Accessor<PopoverState | undefined> => createMemo(() => PopoverStore[id]);
