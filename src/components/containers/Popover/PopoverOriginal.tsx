export interface PopoverOriginalProps {
  title: string;
}

export const PopoverOriginal = (props: ParentProps<PopoverOriginalProps>) => {
  return (
    <div class='contains-popover'>
      {props.title}
      <div class='popover-content'>
        {props.children}
      </div>
    </div>
  );
};
