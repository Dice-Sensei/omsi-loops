import { ParentProps } from 'solid-js';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';

export interface MenuOptionProps {
  title: string;
}

export const MenuOption = (props: ParentProps<MenuOptionProps>) => (
  <Popover>
    <Popover.Trigger>
      <Button variant='text'>{props.title}</Button>
    </Popover.Trigger>
    <Popover.Content class='max-w-[400px]'>
      {props.children}
    </Popover.Content>
  </Popover>
);
