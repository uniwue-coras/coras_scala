import {NavLink, useNavigate} from 'react-router-dom';
import {homeUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {currentUserSelector, logout} from './store';
import {useDispatch, useSelector} from 'react-redux';

export function NavBar(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogout(): void {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <nav className="mb-2 flex flex-row bg-slate-600 text-white">
      <NavLink to={homeUrl} className="p-4 font-bold hover:bg-slate-500">CorAs2</NavLink>

      <div className="flex-grow"/>

      {currentUser
        ? (
          <>
            <NavLink to="/changePassword" className="p-4 hover:bg-slate-500">{t('changePassword')}</NavLink>
            <button type="button" className="p-4 hover:bg-slate-500" onClick={onLogout}>{t('logout')} {currentUser.username}</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="p-4 hover:bg-slate-500">{t('login')}</NavLink>
            <NavLink to="/register" className="p-4 hover:bg-slate-500">{t('register')}</NavLink>
          </>
        )}
    </nav>
  );
}
