import {Field} from 'formik';
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

export function FormField({type = 'text', name, id = name, label, placeholder = label, autoFocus, required, touched, errors}: FormFieldProps): JSX.Element {

  const classes = classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched && errors});

  return (
    <div className="mt-4">
      <label htmlFor={id} className="font-bold">{label}:</label>
      <Field type={type} id={id} name={name} placeholder={placeholder} required={required} autoFocus={autoFocus} className={classes}/>
    </div>
  );
}

interface SubmitButtonProps {
  text: string;
  loading: boolean;
}

export function SubmitButton({text, loading}: SubmitButtonProps): JSX.Element {

  const classes = classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading});

  return (
    <button type="submit" className={classes} disabled={loading}>{text}</button>
  );
}
