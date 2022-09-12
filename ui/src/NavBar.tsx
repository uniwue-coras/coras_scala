import {NavLink, useNavigate} from 'react-router-dom';
import {adminsUrl, changePasswordUrl, correctorsUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {currentUserSelector, userLogoutAction} from './store';
import {useDispatch, useSelector} from 'react-redux';

export function NavBar(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logout(): void {
    dispatch(userLogoutAction);
    navigate(loginUrl);
  }

  return (
    <nav className="flex flex-row bg-slate-600 text-white">
      <NavLink to={homeUrl} className="p-4 font-bold hover:bg-slate-500">CorAs2</NavLink>

      {currentUser && currentUser.rights === 'Admin' && <>
        <NavLink to={correctorsUrl} className="p-4 hover:bg-slate-500">{t('correctors')}</NavLink>
        <NavLink to={adminsUrl} className="p-4 hover:bg-slate-500">{t('admins')}</NavLink>
      </>}

      <div className="flex-grow"/>

      {currentUser
        ? <>
          <NavLink to={changePasswordUrl} className="p-4 hover:bg-slate-500">{t('changePassword')}</NavLink>
          <button type="button" className="p-4 hover:bg-slate-500" onClick={logout}>{t('logout')} {currentUser.username}</button>
        </>
        : <>
          <NavLink to={loginUrl} className="p-4 hover:bg-slate-500">{t('login')}</NavLink>
          <NavLink to={registerUrl} className="p-4 hover:bg-slate-500">{t('register')}</NavLink>
        </>}
    </nav>
  );
}
