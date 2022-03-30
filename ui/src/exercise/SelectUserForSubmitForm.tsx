import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';

interface IProps {
  onSubmit: (username: string) => void;
}

export function SelectUserForSubmitForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <Formik initialValues={{username: ''}} onSubmit={({username}) => onSubmit(username)}>
      {(/*{touched, errors}*/) => <Form>

        <div className="flex flex-rw">
          <Field type="text" name="username" placeholder={t('username')} className="flex-grow p-2 rounded-l border border-slate-600"/>
          <button type="submit" className="p-2 rounded-r bg-blue-600 text-white">{t('submitSolutionForUser')}</button>
        </div>

      </Form>}
    </Formik>
  );
}
