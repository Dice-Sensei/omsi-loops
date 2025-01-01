export type MemoizedFn<This, Fn extends (this: This, ...args: any[]) => any, K = string> = Fn & {
  cache: Map<K, ReturnType<Fn>>;
};

export const memoize = <This, Fn extends (this: This, ...args: any[]) => any, K = string>(
  fn: Fn,
  createId: (this: This, ...args: Parameters<Fn>) => K = (...args) => args.join(',') as K,
): MemoizedFn<This, Fn, K> => {
  const result = function self(...args: Parameters<Fn>) {
    const cache = (self as MemoizedFn<This, Fn, K>).cache;

    const id = createId.apply(this, args);

    if (cache.has(id)) return cache.get(id)!;

    const value = fn.apply(this, args);
    cache.set(id, value);
    return value;
  } as MemoizedFn<This, Fn, K>;
  result.cache = new Map();

  return result;
};
