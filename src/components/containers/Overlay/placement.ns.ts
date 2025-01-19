import { Placement } from '@floating-ui/dom';

export namespace PlacementNs {
  export const toSide = (placement: Placement): 'top' | 'right' | 'bottom' | 'left' => {
    if (placement.startsWith('top')) return 'bottom';
    if (placement.startsWith('right')) return 'left';
    if (placement.startsWith('bottom')) return 'top';
    return 'right';
  };
}
