import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

import { adminInputFocus, adminInputPlain } from './admin-styles';

interface FieldLabelProps {
  label: string;
  children: ReactNode;
}

export function FieldLabel({ label, children }: FieldLabelProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

type LabeledInputProps = {
  label: string;
  usePlainInput?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function LabeledInput({
  label,
  usePlainInput,
  className,
  ...inputProps
}: LabeledInputProps) {
  const base = usePlainInput ? adminInputPlain : adminInputFocus;
  return (
    <FieldLabel label={label}>
      <input className={className ?? base} {...inputProps} />
    </FieldLabel>
  );
}

type LabeledTextareaProps = {
  label: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function LabeledTextarea({ label, className, ...props }: LabeledTextareaProps) {
  return (
    <FieldLabel label={label}>
      <textarea
        className={className ?? adminInputFocus}
        {...props}
      />
    </FieldLabel>
  );
}
