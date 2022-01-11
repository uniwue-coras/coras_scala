import {Dispatch, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {LoginInput, useLoginMutation} from './graphql';
import * as yup from 'yup';
import {Field, Form, Formik} from 'formik';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, StoreAction, userLoginAction} from './store';
import {homeUrl} from './urls';
import {Navigate} from 'react-router-dom';

const initialValues: LoginInput = {username: '', password: ''};

const loginInputSchema: yup.SchemaOf<LoginInput> = yup.object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required()
  })
  .required();

export function LoginForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [login, {loading, error}] = useLoginMutation();
  const [invalidLogin, setInvalidLogin] = useState(false);
  const dispatch = useDispatch<Dispatch<StoreAction>>();

  if (useSelector(currentUserSelector)) {
    return <Navigate to={homeUrl}/>;
  }

  function onSubmit(loginInput: LoginInput): void {
    setInvalidLogin(false);

    login({variables: {loginInput}})
      .then(({data}) =>
        data && data.login
          ? dispatch(userLoginAction(data.login))
          : setInvalidLogin(true)
      )
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('login')}</h1>

      <Formik initialValues={initialValues} validationSchema={loginInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="username" className="label">{t('username')}:</label>
              <div className="control">
                <Field type="text" name="username" id="username" placeholder={t('username')} autoFocus
                       className={classNames('input', {'is-danger': touched.username && errors.username})}/></div>
            </div>

            <div className="field">
              <label htmlFor="password" className="label">{t('password')}:</label>
              <div className="control">
                <Field type="password" name="password" id="password" placeholder={t('password')}
                       className={classNames('input', {'is-danger': touched.password && errors.password})}/></div>
            </div>

            {error && <div className="notification is-warning has-text-centered">{error.message}</div>}

            {invalidLogin && <div className="notification is-warning has-text-centered">{t('invalidUsernamePasswordCombination')}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('login')}
              </button>
            </div>

          </Form>
        }
      </Formik>
    </div>
  );
}
