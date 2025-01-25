import type { JSXElement, ParentProps } from 'solid-js';
import { createContext as createSolidContext, splitProps, useContext } from 'solid-js';

const hmr = new Map<symbol, any>();
export const createContext = <State, Args extends Record<string, unknown>>(
  provider: (props: Args) => State,
): [() => State, (props: ParentProps<Args>) => JSXElement] => {
  const Context = createSolidContext(undefined as State);

  return [
    () => {
      const context = useContext(Context) ?? hmr.get(Context.id);

      if (context === undefined) {
        throw Error(`useContext must be used within a Provider, '${Context.id.toString()}'`);
      }

      hmr.set(Context.id, context);

      return context;
    },
    (props) => {
      const [$, other] = splitProps(props, ['children']);

      return <Context.Provider value={provider(other as Args)}>{$.children}</Context.Provider>;
    },
  ];
};
