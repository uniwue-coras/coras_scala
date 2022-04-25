import {LoginResultFragment, Rights} from '../graphql';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../store';
import {homeUrl, loginUrl} from '../urls';

function rightsIsSufficient(gottenRights: Rights, neededRights: Rights): boolean {
  if (gottenRights === Rights.Student) {
    return false;
  } else if (gottenRights === Rights.Corrector) {
    return neededRights === Rights.Student || neededRights === Rights.Corrector;
  } else {
    return gottenRights === Rights.Admin;
  }
}

interface IProps {
  minimalRights?: Rights,
  to?: string,
  children: (user: LoginResultFragment) => JSX.Element
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
