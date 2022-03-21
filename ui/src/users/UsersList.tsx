import {useTranslation} from 'react-i18next';
import {WithQuery} from '../WithQuery';
import {PromoteUserForm} from './PromoteUserForm';
import {Rights, UsersWithRightsQuery, useUsersWithRightsQuery} from '../graphql';
import {WithNullableNavigate} from '../WithNullableNavigate';

interface IProps {
  rights: Rights;
}

export function UsersList({rights}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const usersWithRightsQuery = useUsersWithRightsQuery({variables: {rights}});

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('usersWithRights{{rights}}', {rights})}</h1>

      <WithQuery query={usersWithRightsQuery}>
        {({adminQueries}: UsersWithRightsQuery) => <WithNullableNavigate t={adminQueries}>
          {({usersWithRights}) => <>
            {usersWithRights.length === 0
              ? <div className="mt-4 p-4 rounded bg-cyan-500 text-white text-center">{t('noUsersFoundWithRights{{rights}}', {rights})}</div>
              : <div className="content">
                <ul>
                  {usersWithRights.map((username) => <li key={username}>{username}</li>)}
                </ul>
              </div>}

            {rights != Rights.Student && <PromoteUserForm rights={rights} onUserPromoted={usersWithRightsQuery.refetch}/>}
          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
