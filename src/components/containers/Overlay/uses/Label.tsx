import { JSX, ParentProps } from 'solid-js';
import { Tooltip } from '../primitives/Tooltip.tsx';

export interface LabelProps {
  class?: string;
  label: JSX.Element;
  labelClass?: string;
}

export const Label = (props: ParentProps<LabelProps>) => (
  <Tooltip>
    <Tooltip.Trigger class={props.class}>
      {props.children}
    </Tooltip.Trigger>
    <Tooltip.Content class={props.labelClass}>
      {props.label}
    </Tooltip.Content>
  </Tooltip>
);
