import { Field } from 'formik';
import { ReactElement } from 'react';
import classNames from 'classnames';

interface FormFieldProps {
  type?: string;
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  touched: boolean | undefined;
  errors: string | undefined;
}

export function FormField({ type = 'text', name, id = name, label, placeholder = label, autoFocus, required, touched, errors }: FormFieldProps): ReactElement {

  const classes = classNames('mt-2 p-2 rounded border border-slate-600 w-full', { 'border-red-600': touched && errors });

  return (
    <div className="mt-4">
      <label htmlFor={id} className="font-bold">{label}:</label>
      <Field type={type} id={id} name={name} placeholder={placeholder} required={required} autoFocus={autoFocus} className={classes} />
    </div>
  );
}

export function SubmitButton({ text, loading }: { text: string, loading: boolean }): ReactElement {
  return (
    <button type="submit" disabled={loading} className={classNames('mt-4 p-2 rounded bg-blue-600 text-white w-full', { 'opacity-50': loading })}>
      {text}
    </button>
  );
}
