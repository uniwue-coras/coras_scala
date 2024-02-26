import { ReactElement, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  currentUserIndex: number;
  allUsernames: string[];
  setCurrentUserIndex: (value: SetStateAction<number>) => void;
}

export function UserNameSelector({ currentUserIndex, allUsernames, setCurrentUserIndex }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="space-x-2">
      <label htmlFor="username" className="font-bold">{t('username')}:</label>
      <select id="username" defaultValue={allUsernames[currentUserIndex]} onChange={(event) => setCurrentUserIndex(parseInt(event.target.value))}
        className="p-2 rounded border border-slate-500 bg-white">
        {allUsernames.map((username, index) => <option key={username} value={index}>{username}</option>)}
      </select>
    </div>
  );
}
