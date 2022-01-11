import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as yup from 'yup';
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

const validationSchema: yup.SchemaOf<ExerciseTaskDefinition> = yup.object()
  .shape({
    title: yup.string().min(4).required(),
    text: yup.string().min(4).required()
  })
  .required();

export function ExerciseTaskDefinitionForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({touched, errors}) =>
        <Form>

          <div className="field">
            <label htmlFor="title" className="label">{t('title')}:</label>
            <div className="control">
              <Field name="title" placeholder={t('title')} className={classNames('input', {'is-danger': touched.title && errors.title})}/>
            </div>
            <ErrorMessage name="title">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
          </div>

          <div className="field">
            <label htmlFor="text" className="label">{t('text')}:</label>
            <div className="control">
              <Field as="textarea" name="text" placeholder={t('text')} rows={20}
                     className={classNames('textarea', {'is-danger': touched.text && errors.text})}/>
            </div>
            <ErrorMessage name="text">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
          </div>

          <div className="field">
            <button type="submit" className="button is-link is-fullwidth">{t('goToSampleSolution')}</button>
          </div>

        </Form>}
    </Formik>
  );
}