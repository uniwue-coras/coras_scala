import {ChangePasswordInput, useChangePasswordMutation} from './graphql';
import {useTranslation} from 'react-i18next';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';

const initialValues: ChangePasswordInput = {
  oldPassword: '', newPassword: '', newPasswordRepeat: ''
};

const validationSchema: yup.SchemaOf<ChangePasswordInput> = yup.object()
  .shape({
    oldPassword: yup.string().required(),
    newPassword: yup.string().required(),
    newPasswordRepeat: yup.string().required()
  })
  .required();

export function ChangePasswordForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [changePassword, {data, loading, error}] = useChangePasswordMutation();

  function onSubmit(changePasswordInput: ChangePasswordInput): void {
    changePassword({variables: {changePasswordInput}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('changePassword')}</h1>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>

          <div className="field">
            <label htmlFor="oldPassword" className="label">{t('oldPassword')}:</label>
            <div className="control">
              <Field type="password" name="oldPassword" className="input" id="oldPassword" placeholder={t('oldPassword')}/>
            </div>
            <ErrorMessage name="oldPassword">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
          </div>

          <div className="field">
            <label htmlFor="newPassword" className="label">{t('newPassword')}:</label>
            <div className="control">
              <Field type="password" name="newPassword" className="input" id="newPassword" placeholder={t('newPassword')}/>
            </div>
            <ErrorMessage name="newPassword">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
          </div>

          <div className="field">
            <label htmlFor="newPasswordRepeat" className="label">{t('newPasswordRepeat')}:</label>
            <div className="control">
              <Field type="password" name="newPasswordRepeat" className="input" id="newPasswordRepeat" placeholder={t('newPasswordRepeat')}/>
            </div>
            <ErrorMessage name="newPasswordRepeat">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
          </div>

          {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

          {!!data?.changePassword && <div className="notification is-success has-text-centered">{t('passwordSuccessfullyChanged')}</div>}

          <div className="field">
            <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
              {t('changePassword')}
            </button>
          </div>

        </Form>
      </Formik>

    </div>
  );
}
