import {NavLink, useNavigate} from 'react-router-dom';
import {JSX} from 'react';
import {changePasswordUrl, homeUrl, loginUrl, registerUrl, relatedWordManagementUrl, userManagementUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {currentUserSelector, logout} from './store';
import {useDispatch, useSelector} from 'react-redux';
import {Rights} from './graphql';

const buttonClasses = 'p-4 hover:bg-slate-500';

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
            {currentUser.rights === Rights.Admin && <>
              <NavLink to={userManagementUrl} className={buttonClasses}>{t('userManagement')}</NavLink>
              <NavLink to={relatedWordManagementUrl} className={buttonClasses}>{t('relatedWordManagment')}</NavLink>
            </>}
            <NavLink to={changePasswordUrl} className={buttonClasses}>{t('changePassword')}</NavLink>
            <button type="button" className={buttonClasses} onClick={onLogout}>{t('logout')} {currentUser.username}</button>
          </>
        ) : (
          <>
            <NavLink to={loginUrl} className={buttonClasses}>{t('login')}</NavLink>
            <NavLink to={registerUrl} className={buttonClasses}>{t('register')}</NavLink>
          </>
        )}
    </nav>
  );
}
