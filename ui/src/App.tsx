import {Dispatch} from 'react';
import {NavLink, Route, Routes, useNavigate} from 'react-router-dom';
import {Home} from './Home';
import {adminsUrl, changePasswordUrl, correctorsUrl, createExerciseUrl, exercisesBaseUrl, homeUrl, loginUrl, registerUrl, synonymsUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {RegisterForm} from './RegisterForm';
import {LoginForm} from './LoginForm';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, StoreAction, userLogoutAction} from './store';
import {Rights} from './graphql';
import {UsersList} from './users/UsersList';
import {SynonymsOverview} from './SynonymsOverview';
import {CreateExercise} from './CreateExercise';
import {ExerciseBase} from './exercise/ExerciseBase';
import {RequireAuth} from './RequireAuth';
import {ChangePasswordForm} from './ChangePasswordForm';
import {HiFingerPrint} from 'react-icons/hi';

export function App(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const navigate = useNavigate();

  function logout(): void {
    dispatch(userLogoutAction);
    navigate(loginUrl);
  }

  return (
    <>
      <nav className="navbar is-dark">
        <div className="navbar-brand">
          <NavLink to={homeUrl} className="navbar-item">CorAs2</NavLink>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            {currentUser && currentUser.rights === Rights.Admin && <>
              <NavLink to={synonymsUrl} className="navbar-item">{t('synonyms')}</NavLink>
              <NavLink to={correctorsUrl} className="navbar-item">{t('correctors')}</NavLink>
              <NavLink to={adminsUrl} className="navbar-item">{t('admins')}</NavLink>
            </>}
          </div>
          <div className="navbar-end">
            {currentUser
              ? <>
                <NavLink to={changePasswordUrl} className="navbar-item"><HiFingerPrint/>&nbsp;{t('changePassword')}</NavLink>
                <div className="navbar-item">
                  <button type="button" className="button" onClick={logout}>{t('logout')} {currentUser.username}</button>
                </div>
              </>
              : <>
                <NavLink to={loginUrl} className="navbar-item">{t('login')}</NavLink>
                <NavLink to={registerUrl} className="navbar-item">{t('register')}</NavLink>
              </>}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path={registerUrl} element={<RegisterForm/>}/>

        <Route path={loginUrl} element={<LoginForm/>}/>

        <Route path={homeUrl} element={
          <RequireAuth>
            {(user) => <Home currentUser={user}/>}
          </RequireAuth>
        }/>

        <Route path={changePasswordUrl} element={
          <RequireAuth>
            {() => <ChangePasswordForm/>}
          </RequireAuth>
        }/>

        <Route path={correctorsUrl} element={
          <RequireAuth minimalRights={Rights.Admin}>
            {() => <UsersList rights={Rights.Corrector}/>}
          </RequireAuth>
        }/>

        <Route path={adminsUrl} element={
          <RequireAuth minimalRights={Rights.Admin}>
            {() => <UsersList rights={Rights.Admin}/>}
          </RequireAuth>
        }/>

        <Route path={synonymsUrl} element={
          <RequireAuth minimalRights={Rights.Admin}>
            {() => <SynonymsOverview/>}
          </RequireAuth>
        }/>

        <Route path={createExerciseUrl} element={
          <RequireAuth minimalRights={Rights.Admin}>
            {() => <CreateExercise/>}
          </RequireAuth>
        }/>

        <Route path={`${exercisesBaseUrl}/:exId/*`} element={
          <RequireAuth>
            {(currentUser) => <ExerciseBase currentUser={currentUser}/>}
          </RequireAuth>
        }/>
      </Routes>
    </>
  );
}
