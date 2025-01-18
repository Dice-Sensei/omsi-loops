export const maybe = <Fn extends () => any>(
  fn: Fn,
  otherwise: ReturnType<Fn> = undefined as ReturnType<Fn>,
): ReturnType<Fn> => {
  try {
    return fn();
  } catch {
    return otherwise;
  }
};
