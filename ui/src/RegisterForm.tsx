import {useTranslation} from 'react-i18next';
import {RegisterInput, useRegisterMutation} from './graphql';
import {Field, Form, Formik} from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';

const initialValues: RegisterInput = {username: '', password: '', passwordRepeat: ''};

const registerInputSchema: yup.SchemaOf<RegisterInput> = yup.object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
    passwordRepeat: yup.string().required()
  })
  .required();

export function RegisterForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [register, {data, loading, error}] = useRegisterMutation();

  function onSubmit(registerInput: RegisterInput): void {
    register({variables: {registerInput}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('register')}</h1>

      <Formik initialValues={initialValues} validationSchema={registerInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="username" className="label">{t('username')}:</label>
              <div className="control">
                <Field type="text" name="username" id="username" placeholder={t('username')} autoFocus
                       className={classNames('input', {'is-danger': touched.username && errors.username})}/>
              </div>
            </div>

            <div className="field">
              <label htmlFor="password" className="label">{t('password')}:</label>
              <div className="control">
                <Field type="password" name="password" id="password" placeholder={t('password')}
                       className={classNames('input', {'is-danger': touched.password && errors.password})}/>
              </div>
            </div>

            <div className="field">
              <label htmlFor="passwordRepeat" className="label">{t('passwordRepeat')}:</label>
              <div className="control">
                <Field type="password" name="passwordRepeat" id="passwordRepeat" placeholder={t('passwordRepeat')}
                       className={classNames('input', {'is-danger': touched.passwordRepeat && errors.passwordRepeat})}/>
              </div>
            </div>

            {error && <div className="notification is-warning has-text-centered">{error.message}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('register')}
              </button>
            </div>

            {data && <div className="notification is-success has-text-centered">{t('userRegistered_{{name}}', {name: data.register})}</div>}

          </Form>
        }
      </Formik>
    </div>
  );
}