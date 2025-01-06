import { Accessor, createSignal } from 'solid-js';

export const createLoadingCallback = <Fn extends (...args: unknown[]) => Promise<unknown> | unknown>(
  callback?: Fn,
): [loading: Accessor<boolean>, fn: (...args: Parameters<Fn>) => Promise<ReturnType<Fn>>] => {
  const [isLoading, setIsLoading] = createSignal(false);

  const fn = async (...args: Parameters<Fn>): Promise<ReturnType<Fn>> => {
    try {
      setIsLoading(true);
      return await callback?.(...args) as Promise<ReturnType<Fn>>;
    } finally {
      setIsLoading(false);
    }
  };

  return [isLoading, fn];
};
