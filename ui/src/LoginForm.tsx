import {Dispatch} from 'react';
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
  const dispatch = useDispatch();

  if (useSelector(currentUserSelector)) {
    return <Navigate to={homeUrl}/>;
  }

  function onSubmit(loginInput: LoginInput): void {
    login({variables: {loginInput}})
      .then(({data}) => data && data.login && dispatch(userLoginAction(data.login)))
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('login')}</h1>

      <Formik initialValues={initialValues} validationSchema={loginInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="mt-4">
              <label htmlFor="username" className="font-bold">{t('username')}:</label>
              <Field type="text" name="username" id="username" placeholder={t('username')} autoFocus
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.username && errors.username})}/>
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="font-bold">{t('password')}:</label>
              <Field type="password" name="password" id="password" placeholder={t('password')}
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.password && errors.password})}/>
            </div>

            {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

            <button type="submit" className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
                    disabled={loading}>
              {t('login')}
            </button>
          </Form>
        }
      </Formik>
    </div>
  );
}
