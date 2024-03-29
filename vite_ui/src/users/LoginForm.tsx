import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { homeUrl } from '../urls';
import { Navigate } from 'react-router-dom';
import { useLoginMutation } from '../graphql';
import { currentUserSelector, login } from '../store';
import { FormField, SubmitButton } from './FormField';
import { ReactElement } from 'react';
import * as yup from 'yup';

interface LoginInput {
  username: string;
  password: string;
}

const initialValues: LoginInput = { username: '', password: '' };

const loginInputSchema: yup.ObjectSchema<LoginInput> = yup.object({
  username: yup.string().required(),
  password: yup.string().required()
}).required();

export function LoginForm(): ReactElement {

  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [loginMutation, { loading, error }] = useLoginMutation();

  if (useSelector(currentUserSelector)) {
    return <Navigate to={homeUrl} />;
  }

  async function onSubmit({ username, password }: LoginInput): Promise<void> {
    try {
      const result = await loginMutation({ variables: { username, password } });

      if (result?.data) {
        dispatch(login(result.data.login));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('login')}</h1>

      <Formik initialValues={initialValues} validationSchema={loginInputSchema} onSubmit={onSubmit}>
        {({ touched, errors }) => <Form>

          <FormField name="username" label={t('username')} required autoFocus touched={touched.username} errors={errors.username} />

          <FormField type="password" name="password" label={t('password')} required touched={touched.password} errors={errors.password} />

          {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

          <SubmitButton text={t('login')} loading={loading} />
        </Form>}
      </Formik>
    </div>
  );
}
