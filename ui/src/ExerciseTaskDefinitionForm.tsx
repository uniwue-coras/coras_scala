import {Field, Form, Formik} from 'formik';
import {object as yupObject, SchemaOf, string as yupString} from 'yup';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

export interface ExerciseTaskDefinition {
  title: string;
  text: string;
}

interface IProps {
  onSubmit: (values: ExerciseTaskDefinition) => void;
}

const initialValues: ExerciseTaskDefinition = {title: '', text: ''};

const validationSchema: SchemaOf<ExerciseTaskDefinition> = yupObject({
  title: yupString().min(4).required(),
  text: yupString().min(4).required()
}).required();

export function ExerciseTaskDefinitionForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({touched, errors}) => <Form>

        <div className="mt-4">
          <label htmlFor="title" className="font-bold">{t('title')}:</label>
          <Field name="title" placeholder={t('title')}
                 className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.title && errors.title})}/>
        </div>

        <div className="mt-4">
          <label htmlFor="text" className="font-bold">{t('text')}:</label>
          <Field as="textarea" name="text" placeholder={t('text')} rows={20}
                 className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.text && errors.text})}/>
        </div>

        <button type="submit" className="mt-4 p-2 rounded bg-blue-600 text-white w-full">{t('goToSampleSolution')}</button>

      </Form>}
    </Formik>
  );
}
