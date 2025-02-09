import { createSignal } from 'solid-js';

export namespace KeyboardKey {
  export const [shift, setShift] = createSignal(false);
  export const toggleShiftOff = () => setShift(false);
  export const toggleShiftOn = () => setShift(true);

  export const [control, setControl] = createSignal(false);
  export const toggleControlOff = () => setControl(false);
  export const toggleControlOn = () => setControl(true);
}
