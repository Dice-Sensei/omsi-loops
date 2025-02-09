import { createSignal } from 'solid-js';

export namespace KeyboardKey {
  export const [shift, setShift] = createSignal(false);

  export const [control, setControl] = createSignal(false);
}
