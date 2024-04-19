import { ReactElement, useState } from 'react';
import { Rights, useChangeRightsMutation, UserFragment, useUserManagementQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import update from 'immutability-helper';

interface IProps {
  initialUsers: UserFragment[];
}

const allRights: Rights[] = [Rights.Student, Rights.Corrector, Rights.Admin];

function Inner({ initialUsers }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [users, setUsers] = useState(initialUsers);
  const [changeRights] = useChangeRightsMutation();

  const updateRights = async (username: string, newRights: Rights, index: number) => {
    try {
      const { data } = await changeRights({ variables: { username, newRights } });

      if (data?.changeRights) {
        const realNewRights = data.changeRights;
        setUsers((users) => update(users, { [index]: { rights: { $set: realNewRights } } }));
      }
    } catch (error) {
      console.info(error)
    };
  }

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-center text-2xl">{t('userManagement')}</h1>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th>{t('username')}</th>
            <th>{t('rights')}</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {users.map(({ username, rights }, index) => <tr key={username} className="border-t border-slate-500">
            <td className="p-2">{username}</td>
            <td className="p-2">
              <select value={rights} className="p-2 rounded border border-slate-500 bg-white w-full"
                onChange={(event) => updateRights(username, event.target.value as Rights, index)}>
                {allRights.map((right) => <option key={right}>{right}</option>)}
              </select>
            </td>
          </tr>)}
        </tbody>
      </table>

    </div>
  );
}

export function UserManagement(): ReactElement {
  return (
    <WithQuery query={useUserManagementQuery()}>
      {({ users }) => <Inner initialUsers={users} />}
    </WithQuery>
  );
}
