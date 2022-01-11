import {homeUrl} from './urls';
import {Navigate} from 'react-router-dom';

interface IProps<T> {
  t: T | null | undefined;
  children: (t: T) => JSX.Element;
  to?: string;
}

export function WithNullableNavigate<T>({t, children, to = homeUrl}: IProps<T>): JSX.Element {
  return t
    ? children(t)
    : <Navigate to={to}/>;
}
