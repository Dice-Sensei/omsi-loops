export interface MemoizedFn<This, Fn extends (this: This, ...args: any[]) => any, K = string> {
  (this: This, ...args: Parameters<Fn>): ReturnType<Fn>;
  cache: Map<K, ReturnType<Fn>>;
}

export const memoize = <This, Fn extends (this: This, ...args: any[]) => any, K = string>(
  fn: Fn,
  createId: (this: This, ...args: Parameters<Fn>) => K = (...args) => args.join(',') as K,
): MemoizedFn<This, Fn, K> => {
  const result: MemoizedFn<This, Fn, K> = function self(...args) {
    const cache = self.cache;

    const id = createId.apply(this, args);

    if (cache.has(id)) return cache.get(id)!;

    const value = fn.apply(this, args);
    cache.set(id, value);
    return value;
  };
  result.cache = new Map();

  return result;
};
