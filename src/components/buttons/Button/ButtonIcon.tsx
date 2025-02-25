import { Button, ButtonProps } from './Button.tsx';
import { Icon, IconName, IconProps } from './Icon.tsx';
import cx from 'clsx';

export interface ButtonIconProps extends ButtonProps {
  name: IconName;
  icon?: Omit<IconProps, 'name'>;
}

export const ButtonIcon = (props: ButtonIconProps) => (
  <Button
    variant='text'
    {...props}
    class={cx(
      'text-amber-900 w-6 h-6 min-h-[unset] rounded-full hover:bg-amber-100 active:bg-amber-200 transition-colors flex items-center justify-center',
      props.class,
    )}
  >
    <Icon {...props.icon} name={props.name} />
  </Button>
);
