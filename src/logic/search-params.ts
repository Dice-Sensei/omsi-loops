export namespace SearchParams {
  const self = () => new URLSearchParams(globalThis.location.search);

  type GetOptions<T extends string | null> = {
    expected: T[];
    fallback: T;
  };

  export const get = <T extends string | null = string | null>(name: string, options: GetOptions<T>): T => {
    const value = self().get(name) as T;

    return value && options.expected.includes(value) ? value : options.fallback;
  };

  export const set = <T extends string>(name: string, value: T | null): void => {
    const params = self();

    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    globalThis.location.search = params.toString();
  };
}
