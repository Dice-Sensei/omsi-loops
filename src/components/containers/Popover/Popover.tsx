export interface PopoverProps {
  title: string;
}

export const Popover = (props: ParentProps<PopoverProps>) => {
  return (
    <div class='contains-popover'>
      {props.title}
      <div class='popover-content'>
        {props.children}
      </div>
    </div>
  );
};
