import { createMemo } from 'solid-js';
import { InputField, InputFieldProps } from './InputField.tsx';
import { NumberInputValidator } from './validators/NumberInputValidator.tsx';

export type NumberFieldProps = Omit<InputFieldProps<number | null>, 'serialize' | 'deserialize' | 'type'> & {
  min?: number;
  max?: number;
};

export const NumberField = (props: NumberFieldProps) => {
  const parser = createMemo(() => NumberInputValidator.create(props));

  return (
    <InputField
      {...props}
      type='text'
      validate={parser().validate}
      serialize={parser().serialize}
      deserialize={parser().deserialize}
    />
  );
};
