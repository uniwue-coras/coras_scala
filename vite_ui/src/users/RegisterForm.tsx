import {useTranslation} from 'react-i18next';
import {Form, Formik} from 'formik';
import {object as yupObject, Schema, string as yupString} from 'yup';
import {useRegisterMutation} from '../graphql';
import {FormField, SubmitButton} from './FormField';

interface RegisterInput {
  username: string;
  password: string;
  passwordRepeat: string;
}

const initialValues: RegisterInput = {username: '', password: '', passwordRepeat: ''};

const registerInputSchema: Schema<RegisterInput> = yupObject({
  username: yupString().required(),
  password: yupString().required(),
  passwordRepeat: yupString().required()
}).required();

export function RegisterForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [register, {data, loading, error}] = useRegisterMutation();

  function onSubmit({username, password, passwordRepeat}: RegisterInput): void {
    register({variables: {username, password, passwordRepeat}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('register')}</h1>

      <Formik initialValues={initialValues} validationSchema={registerInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) => <Form>

          <FormField name="username" label={t('username')} required autoFocus touched={touched.username} errors={errors.username}/>

          <FormField type="password" name="password" label={t('password')} required touched={touched.password} errors={errors.password}/>

          <FormField type="password" name="passwordRepeat" label={t('passwordRepeat')} required touched={touched.passwordRepeat}
                     errors={errors.passwordRepeat}/>

          {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

          <SubmitButton text={t('register')} loading={loading}/>

          {data && <div className="mt-4 p-4 rounded bg-green-600 text-white text-center">{t('userRegistered_{{name}}', {name: data.register})}</div>}

        </Form>}
      </Formik>
    </div>
  );
}
