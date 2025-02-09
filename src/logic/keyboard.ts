import { shift } from '@floating-ui/dom';
import { Listeners } from './listeners.ts';

export namespace Keyboard {
  type KeyDescriptor = {
    handler: KeyboardEventFn;
    description: string;
    combination: string;
    repeatable: boolean;
    type: 'keyup' | 'keydown';
  };

  export const descriptors: KeyDescriptor[] = [];
  const attach = (descriptor: KeyDescriptor) => {
    descriptors.push(descriptor);
    Listeners.add(descriptor.type, descriptor.handler);
  };

  type KeyboardEventFn = (event: KeyboardEvent) => Promise<any> | any;
  type KeyFn = { fn: KeyboardEventFn; description: string };
  type AddOptions = {
    onDown?: KeyFn;
    onUp?: KeyFn;
    combination: string | string[];
    repeatable?: boolean;
  };

  export const listen = ({ onDown, onUp, combination, repeatable = false }: AddOptions): typeof Keyboard => {
    const combinations = Array.isArray(combination) ? combination : [combination];

    for (const combination of combinations) {
      const keys = new Set(combination.toLowerCase().trim().split('+'));
      const useShift = keys.delete('shift');
      const useControl = keys.delete('ctrl');
      const useAlt = keys.delete('alt');
      const useMeta = keys.delete('meta');
      const keyStr = keys.keys().next().value;
      const key = keyStr === 'space' ? ' ' : keyStr;
      const useKey = key !== undefined;

      if (onDown) {
        attach({
          handler: async (event: KeyboardEvent) => {
            if (!repeatable && event.repeat) return;
            if (useShift && !event.shiftKey) return;
            if (useControl && !event.ctrlKey) return;
            if (useAlt && !event.altKey) return;
            if (useMeta && !event.metaKey) return;
            if (useKey && key !== event.key.toLowerCase()) return;

            await onDown.fn(event);
          },
          description: onDown.description,
          combination,
          repeatable,
          type: 'keydown',
        });
      }

      if (onUp) {
        attach({
          handler: async (event: KeyboardEvent) => {
            if (!repeatable && event.repeat) return;
            if (useKey && key !== event.key.toLowerCase()) return;

            await onUp.fn(event);
          },
          description: onUp.description,
          combination,
          repeatable,
          type: 'keyup',
        });
      }
    }

    return Keyboard;
  };

  export const listens = (options: AddOptions[]) => {
    for (const option of options) Keyboard.listen(option);
    return Keyboard;
  };
}
