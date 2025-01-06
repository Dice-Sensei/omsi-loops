export namespace Listeners {
  export const add = <T extends keyof WindowEventMap>(
    event: T,
    fn: (this: Window, ev: WindowEventMap[T]) => Promise<void> | void,
  ) => {
    globalThis.addEventListener(event, fn);
    return Listeners;
  };
}
