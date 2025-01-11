import { createUniqueId, mergeProps, ParentProps } from 'solid-js';
import { EventType } from './InputField.tsx';
import cx from 'clsx';

export type CheckboxFieldProps = {
  onChange: (value: boolean, event: EventType<HTMLInputElement>) => void;
  value: boolean | 'indeterminate';
  id?: string;
  disabled?: boolean;
  class?: string;
  inputclass?: string;
  labelclass?: string;
};

export const CheckboxField = (props: ParentProps<CheckboxFieldProps>) => {
  const $ = mergeProps({ id: props.id ?? createUniqueId() }, props);

  return (
    <div class={cx('flex items-center gap-2 group', $.class)}>
      <input
        id={$.id}
        type='checkbox'
        indeterminate={$.value === 'indeterminate'}
        checked={$.value !== 'indeterminate' ? $.value : false}
        onChange={(event) => $.onChange(event.currentTarget.checked, event)}
        disabled={$.disabled}
        class={cx('disabled:cursor-not-allowed', $.inputclass)}
      />
      <label for={$.id} class={cx('group-has-[input:disabled]:cursor-not-allowed', $.labelclass)}>{$.children}</label>
    </div>
  );
};
