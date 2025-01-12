import { Component, ComponentProps, ParentProps } from 'solid-js';

export const withProvider =
  <C extends Component<any>, P extends Component<ParentProps>>(Provider: P, Component: C) =>
  (props: ComponentProps<C>) => (
    <Provider>
      <Component {...props} />
    </Provider>
  );

export const withProviders = <C extends Component<any>, P extends Component<ParentProps>>(
  providers: P[],
  Component: C,
) =>
(props: ComponentProps<C>) => (
  providers.reduce((children, Provider) => <Provider>{children}</Provider>, <Component {...props} />)
);
