import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import { Form, Formik } from 'formik';
import { useChangePasswordMutation } from '../graphql';
import { FormField, SubmitButton } from './FormField';
import * as yup from 'yup';

interface ChangePasswordInput {
  oldPassword: string;
  password: string;
  passwordRepeat: string;
}

const initialValues: ChangePasswordInput = { oldPassword: '', password: '', passwordRepeat: '' };

const validationSchema: yup.ObjectSchema<ChangePasswordInput> = yup.object({
  oldPassword: yup.string().required(),
  password: yup.string().required(),
  passwordRepeat: yup.string().required()
}).required();

export function ChangePasswordForm(): ReactElement {

  const { t } = useTranslation('common');
  const [changePassword, { data, loading, error }] = useChangePasswordMutation();

  async function onSubmit({ oldPassword, password, passwordRepeat }: ChangePasswordInput): Promise<void> {
    try {
      await changePassword({ variables: { oldPassword, password, passwordRepeat } });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('changePassword')}</h1>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ touched, errors }) => <Form>

          <FormField type="password" name="oldPassword" label={t('oldPassword')} touched={touched.oldPassword} errors={errors.oldPassword} required autoFocus />

          <FormField type="password" name="password" label={t('newPassword')} touched={touched.password} errors={errors.password} required />

          <FormField type="password" name="passwordRepeat" label={t('newPasswordRepeat')} touched={touched.passwordRepeat} errors={errors.passwordRepeat} />

          {error && <div className="mt-4 p-4 rounded bg-red-600 text-white text-center">{error.message}</div>}

          <SubmitButton text={t('changePassword')} loading={loading} />

          {!!data && <div className="mt-4 p-4 rounded bg-green-600 text-white text-center">{t('passwordSuccessfullyChanged')}</div>}

        </Form>}
      </Formik>
    </div>
  );
}
