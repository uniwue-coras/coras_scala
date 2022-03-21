import {ChangePasswordInput, useChangePasswordMutation} from './graphql';
import {useTranslation} from 'react-i18next';
import {Field, Form, Formik} from 'formik';
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
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('changePassword')}</h1>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="mt-4">
              <label htmlFor="oldPassword" className="font-bold">{t('oldPassword')}:</label>
              <Field type="password" name="oldPassword" id="oldPassword" placeholder={t('oldPassword')} autoFocus
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.oldPassword && errors.oldPassword})}/>
            </div>

            <div className="mt-4">
              <label htmlFor="newPassword" className="font-bold">{t('newPassword')}:</label>
              <Field type="password" name="newPassword" id="newPassword" placeholder={t('newPassword')}
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.newPassword && errors.newPassword})}/>
            </div>

            <div className="mt-4">
              <label htmlFor="newPasswordRepeat" className="font-bold">{t('newPasswordRepeat')}:</label>
              <Field type="password" name="newPasswordRepeat" id="newPasswordRepeat" placeholder={t('newPasswordRepeat')}
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.newPasswordRepeat && errors.newPasswordRepeat})}/>
            </div>

            {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

            {!!data?.changePassword && <div className="mt-4 p-4 rounded bg-green-600 text-white text-center">{t('passwordSuccessfullyChanged')}</div>}

            <button type="submit" className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
                    disabled={loading}>
              {t('changePassword')}
            </button>
          </Form>}
      </Formik>

    </div>
  );
}
