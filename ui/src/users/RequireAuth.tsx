import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {currentUserSelector, User} from '../store';
import {homeUrl, loginUrl} from '../urls';
import {Rights} from '../graphql';

function rightsIsSufficient(gottenRights: Rights, neededRights: Rights): boolean {
  switch (neededRights) {
    case Rights.Student:
      return true;
    case Rights.Corrector:
      return gottenRights !== Rights.Student;
    case Rights.Admin:
      return gottenRights === Rights.Admin;
  }
}

interface IProps {
  minimalRights?: Rights;
  to?: string;
  children: (user: User) => JSX.Element;
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
