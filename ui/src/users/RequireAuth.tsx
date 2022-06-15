import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../store';
import {homeUrl, loginUrl} from '../urls';
import {ILoginResult} from '../myTsModels';

type Rights = 'Student' | 'Corrector' | 'Admin';

function rightsIsSufficient(gottenRights: Rights, neededRights: Rights): boolean {
  if (gottenRights === 'Student') {
    return false;
  } else if (gottenRights === 'Corrector') {
    return neededRights === 'Student' || neededRights === 'Corrector';
  } else {
    return gottenRights === 'Admin';
  }
}

interface IProps {
  minimalRights?: Rights,
  to?: string,
  children: (user: ILoginResult) => JSX.Element
}

export function RequireAuth({minimalRights, to = homeUrl, children}: IProps): JSX.Element {

  const currentUser = useSelector(currentUserSelector);

  if (!currentUser) {
    return <Navigate to={loginUrl}/>;
  }

  return !minimalRights || rightsIsSufficient(currentUser.rights, minimalRights)
    ? children(currentUser)
    : <Navigate to={to}/>;
}
