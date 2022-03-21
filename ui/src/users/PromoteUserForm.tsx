import {ChangeEvent} from 'react';
import {ChangeUserRightsMutationVariables, Rights, useChangeUserRightsMutation, useUsersByPrefixLazyQuery} from '../graphql';
import {useTranslation} from 'react-i18next';
import {Field, Form, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';

interface IProps {
  rights: Rights;
  onUserPromoted: () => void;
}


const validationSchema: yup.SchemaOf<ChangeUserRightsMutationVariables> = yup.object()
  .shape({
    username: yup.string().required(),
    rights: yup.mixed().oneOf([Rights.Student, Rights.Corrector, Rights.Admin]).required()
  })
  .required();

export function PromoteUserForm({rights, onUserPromoted}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [getUsersByPrefix, usersByPrefixLazyQuery] = useUsersByPrefixLazyQuery();
  const [promoteToCorrector, {error, loading}] = useChangeUserRightsMutation();

  const initialValues: ChangeUserRightsMutationVariables = {username: '', rights};

  function onSubmit(variables: ChangeUserRightsMutationVariables, {resetForm}: FormikHelpers<ChangeUserRightsMutationVariables>): void {
    promoteToCorrector({variables})
      .then(() => {
        onUserPromoted();
        resetForm();
      })
      .catch((error) => console.error(error));
  }

  function onNameChange(prefix: string): void {
    getUsersByPrefix({variables: {prefix}});
  }

  const usersByPrefix: string[] | undefined = usersByPrefixLazyQuery.data?.adminQueries?.usersByPrefix;

  return (
    <div className="mt-4">

      <h2 className="font-bold text-xl text-center">{t('addUserWithRights{{rights}}', {rights})}</h2>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="mt-4">
              <label htmlFor="username" className="font-bold">{t('username')}:</label>
              <Field type="text" name="username" id="username" placeholder={t('username')} list={usersByPrefix ? 'usersByPrefix' : undefined}
                     onKeyUp={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
                     className={classNames('mt-2', 'p-2', 'rounded', 'border', 'border-slate-600', 'w-full', {'border-red-600': touched.username && errors.username})}/>

              {usersByPrefix && <datalist id="usersByPrefix">
                {usersByPrefix.map((username) => <option key={username} value={username}>{username}</option>)}
              </datalist>}
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            <button type="submit" className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'is-loading': loading})}
                    disabled={loading}>
              {t('addCorrector')}
            </button>

          </Form>
        }
      </Formik>
    </div>
  );
}
