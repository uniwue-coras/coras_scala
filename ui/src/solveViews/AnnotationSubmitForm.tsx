import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';

interface IProps {
  onSubmit: (value: string) => void;
}

interface FormValues {
  value: string;
}

const initialValues: FormValues = {value: ''};

const validationSchema: yup.SchemaOf<FormValues> = yup.object()
  .shape({
    value: yup.string().min(2).required()
  })
  .required();

export function AnnotationSubmitForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={({value}) => onSubmit(value)}>
      {({touched, errors}) => <Form>

        <div className="flex">

          <Field name="value"
                 className={classNames('p-2', 'rounded-l', 'border', touched.value && errors.value ? 'border-red-500' : 'border-slate-500', 'flex-grow')}
                 placeholder={t('annotation')}/>

          <button type="submit" className="p-2 rounded-r border-y border-r border-slate-500">&#10004;</button>
        </div>

      </Form>}
    </Formik>
  );
}
