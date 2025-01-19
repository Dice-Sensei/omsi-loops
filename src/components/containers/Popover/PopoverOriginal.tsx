import { ParentProps } from 'solid-js';

export interface PopoverOriginalProps {
  title: string;
}

export const PopoverOriginal = (props: ParentProps<PopoverOriginalProps>) => (
  <div class='contains-popover'>
    {props.title}
    <div class='popover-content'>
      {props.children}
    </div>
  </div>
);
