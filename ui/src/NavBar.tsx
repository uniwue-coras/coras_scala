import {NavLink, useNavigate} from 'react-router-dom';
import {changePasswordUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {currentUserSelector, logout} from './newStore';
import {useDispatch, useSelector} from 'react-redux';

export function NavBar(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogout(): void {
    dispatch(logout());
    navigate(loginUrl);
  }

  return (
    <nav className="mb-2 flex flex-row bg-slate-600 text-white">
      <NavLink to={homeUrl} className="p-4 font-bold hover:bg-slate-500">CorAs2</NavLink>

      <div className="flex-grow"/>

      {currentUser
        ? (
          <>
            <NavLink to={changePasswordUrl} className="p-4 hover:bg-slate-500">{t('changePassword')}</NavLink>
            <button type="button" className="p-4 hover:bg-slate-500" onClick={onLogout}>{t('logout')} {currentUser.username}</button>
          </>
        ) : (
          <>
            <NavLink to={loginUrl} className="p-4 hover:bg-slate-500">{t('login')}</NavLink>
            <NavLink to={registerUrl} className="p-4 hover:bg-slate-500">{t('register')}</NavLink>
          </>
        )}
    </nav>
  );
}
