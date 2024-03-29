import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import { ReactElement } from 'react';

interface IProps {
  onSubmit: (username: string) => void;
}

const initialValues = {
  username: ''
};

export function SelectUserForSubmitForm({ onSubmit }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <Formik initialValues={initialValues} onSubmit={({ username }) => onSubmit(username)}>
      {(/*{touched, errors}*/) => <Form>

        <div className="flex flex-rw">
          <Field type="text" name="username" placeholder={t('username')} className="flex-grow p-2 rounded-l border border-slate-600" />
          <button type="submit" className="p-2 rounded-r bg-blue-600 text-white">{t('submitSolutionForUser')}</button>
        </div>

      </Form>}
    </Formik>
  );
}
