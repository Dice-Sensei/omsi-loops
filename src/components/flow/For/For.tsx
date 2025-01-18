import { ComponentProps, For as SolidFor, splitProps, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type ForProps<T extends ValidComponent, P extends ComponentProps<T>> =
  & ComponentProps<typeof SolidFor>
  & { as?: T }
  & { [K in keyof P]: P[K] };

const splitKeys = ['as', 'children', 'each', 'fallback'] as const;
export const For = <T extends ValidComponent, P extends ComponentProps<T>>(props: ForProps<T, P>) => {
  const [forProps, dynamicProps] = splitProps(props, splitKeys);

  if (forProps.as) {
    return (
      <Dynamic component={forProps.as} {...dynamicProps}>
        <SolidFor each={forProps.each} fallback={forProps.fallback}>{forProps.children}</SolidFor>
      </Dynamic>
    );
  }

  return <SolidFor each={forProps.each} fallback={forProps.fallback}>{forProps.children}</SolidFor>;
};
