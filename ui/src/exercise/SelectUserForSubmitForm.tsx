import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';

interface IProps {
  onSubmit: (username: string) => void;
}

export function SelectUserForSubmitForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <Formik initialValues={{username: ''}} onSubmit={({username}) => onSubmit(username)}>
      <Form>
        <div className="field has-addons">
          <div className="control is-expanded">
            <Field type="text" name="username" className="input" placeholder={t('username')}/>
          </div>
          <div className="control">
            <button type="submit" className="button is-primary is-fullwidth">{t('submitSolutionForUser')}</button>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
