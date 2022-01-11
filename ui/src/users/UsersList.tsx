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
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('usersWithRights{{rights}}', {rights})}</h1>

      <WithQuery query={usersWithRightsQuery}>
        {({adminQueries}: UsersWithRightsQuery) => <WithNullableNavigate t={adminQueries}>
          {({usersWithRights}) => <>
            {usersWithRights.length === 0
              ? <div className="notification is-primary has-text-centered">{t('noUsersFoundWithRights{{rights}}', {rights})}</div>
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
