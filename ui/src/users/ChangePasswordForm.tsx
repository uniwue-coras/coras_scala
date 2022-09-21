import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';
import {object as yupObject, SchemaOf, string as yupString} from 'yup';
import classNames from 'classnames';
import {useChangePasswordMutation} from '../graphql';

interface ChangePasswordInput {
  oldPassword: string;
  password: string;
  passwordRepeat: string;
}

const initialValues: ChangePasswordInput = {oldPassword: '', password: '', passwordRepeat: ''};

const validationSchema: SchemaOf<ChangePasswordInput> = yupObject({
  oldPassword: yupString().required(),
  password: yupString().required(),
  passwordRepeat: yupString().required()
}).required();

export function ChangePasswordForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [changePassword, {data, loading, error}] = useChangePasswordMutation();

  function onSubmit({oldPassword, password, passwordRepeat}: ChangePasswordInput): void {
    changePassword({variables: {oldPassword, password, passwordRepeat}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('changePassword')}</h1>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({touched, errors}) => <Form>

          <div className="mt-4">
            <label htmlFor="oldPassword" className="font-bold">{t('oldPassword')}:</label>
            <Field type="password" name="oldPassword" id="oldPassword" placeholder={t('oldPassword')} autoFocus
                   className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.oldPassword && errors.oldPassword})}/>
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="font-bold">{t('newPassword')}:</label>
            <Field type="password" name="password" id="password" placeholder={t('newPassword')}
                   className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.password && errors.password})}/>
          </div>

          <div className="mt-4">
            <label htmlFor="passwordRepeat" className="font-bold">{t('newPasswordRepeat')}:</label>
            <Field type="password" name="passwordRepeat" id="passwordRepeat" placeholder={t('newPasswordRepeat')}
                   className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.passwordRepeat && errors.passwordRepeat})}/>
          </div>

          {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

          {!!data && <div className="mt-4 p-4 rounded bg-green-600 text-white text-center">{t('passwordSuccessfullyChanged')}</div>}

          <button type="submit" className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
                  disabled={loading}>
            {t('changePassword')}
          </button>

        </Form>}
      </Formik>
    </div>
  );
}
