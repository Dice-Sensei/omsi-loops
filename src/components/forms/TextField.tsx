import { InputField, InputFieldProps } from './InputField.tsx';
import { identity } from '../../utils/identity.ts';

export type TextFieldProps = Omit<InputFieldProps<string>, 'serialize' | 'deserialize' | 'type'>;

export const TextField = (props: TextFieldProps) => (
  <InputField {...props} type='text' serialize={identity} deserialize={identity} />
);
