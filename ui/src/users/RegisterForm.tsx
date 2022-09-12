import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';
import {object as yupObject, SchemaOf, string as yupString} from 'yup';
import classNames from 'classnames';
import {RegisterInput, useRegisterMutation} from '../graphql';

const initialValues: RegisterInput = {username: '', password: '', passwordRepeat: ''};

const registerInputSchema: SchemaOf<RegisterInput> = yupObject({
  username: yupString().required(),
  password: yupString().required(),
  passwordRepeat: yupString().required()
}).required();

export function RegisterForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [register, {data, loading, error}] = useRegisterMutation();

  function onSubmit(registerInput: RegisterInput): void {
    register({variables: {registerInput}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('register')}</h1>

      <Formik initialValues={initialValues} validationSchema={registerInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) => <Form>

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

          <div className="mt-4">
            <label htmlFor="passwordRepeat" className="font-bold">{t('passwordRepeat')}:</label>
            <Field type="password" name="passwordRepeat" id="passwordRepeat" placeholder={t('passwordRepeat')}
                   className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.passwordRepeat && errors.passwordRepeat})}/>
          </div>

          {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

          <button type="submit" className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
                  disabled={loading}>
            {t('register')}
          </button>

          {data && <div className="mt-4 p-4 rounded bg-green-600 text-white text-center">{t('userRegistered_{{name}}', {name: data})}</div>}

        </Form>}
      </Formik>
    </div>
  );
}
