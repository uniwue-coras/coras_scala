import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { currentUserSelector, User } from '../store';
import { homeUrl } from '../urls';
import { Rights } from '../graphql';
import { ReactElement } from 'react';

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
  children: (user: User) => ReactElement;
}

export function RequireAuth({ minimalRights, to = homeUrl, children }: IProps): ReactElement {

  const currentUser = useSelector(currentUserSelector);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return !minimalRights || rightsIsSufficient(currentUser.rights, minimalRights)
    ? children(currentUser)
    : <Navigate to={to} />;
}
