import { createEffect, createSignal } from 'solid-js';

export namespace KeyboardKey {
  export const [shift, setShift] = createSignal(false);

  createEffect(() => {
    console.log('shift', shift());
  });

  export const [control, setControl] = createSignal(false);
}
