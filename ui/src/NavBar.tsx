import { NavLink, useNavigate } from 'react-router-dom';
import { JSX, useState } from 'react';
import { abbreviationManagementUrl, changePasswordUrl, homeUrl, loginUrl, registerUrl, relatedWordManagementUrl, userManagementUrl } from './urls';
import { useTranslation } from 'react-i18next';
import { currentUserSelector, logout } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { Rights } from './graphql';
import classNames from 'classnames';

const buttonClasses = 'block p-4 hover:bg-slate-500';

export function NavBar(): JSX.Element {

  const { t } = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogout(): void {
    dispatch(logout());
    navigate(loginUrl);
  }

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className="text-white flex flex-col h-full borde">
      <NavLink to={homeUrl} className={classNames(buttonClasses, 'font-bold text-xl')}>
        <img src="/logo192.png" width="25" height="25" className="inline" />
        {!isCollapsed && <>&nbsp;CorAs2</>}
      </NavLink>

      {!isCollapsed &&
        <>
          {currentUser
            ? (
              <>
                {currentUser.rights === Rights.Admin && <>
                  <NavLink to={userManagementUrl} className={buttonClasses}>{t('userManagement')}</NavLink>
                  <NavLink to={abbreviationManagementUrl} className={buttonClasses}>{t('abbreviationManagement')}</NavLink>
                  <NavLink to={relatedWordManagementUrl} className={buttonClasses}>{t('relatedWordManagement')}</NavLink>
                </>}
                <NavLink to={changePasswordUrl} className={buttonClasses}>{t('changePassword')}</NavLink>
                <button type="button" className={classNames(buttonClasses, 'text-left')} onClick={onLogout}>{t('logout')} {currentUser.username}</button>
              </>
            ) : (
              <>
                <NavLink to={loginUrl} className={buttonClasses}>{t('login')}</NavLink>
                <NavLink to={registerUrl} className={buttonClasses}>{t('register')}</NavLink>
              </>
            )}
        </>}


      <div className="flex-grow" />

      <button type="button" className={classNames(buttonClasses, 'text-2xl')} onClick={() => setIsCollapsed((state) => !state)}>
        &#9776;
      </button>
    </nav>
  );
}
