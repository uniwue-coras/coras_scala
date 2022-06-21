import {NavLink, Route, Routes, useNavigate} from 'react-router-dom';
import {Home} from './Home';
import {adminsUrl, changePasswordUrl, correctorsUrl, createExerciseUrl, exercisesBaseUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {useTranslation} from 'react-i18next';
import {RegisterForm} from './users/RegisterForm';
import {LoginForm} from './users/LoginForm';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, userLogoutAction} from './store';
import {CreateExercise} from './CreateExercise';
import {ExerciseBase} from './exercise/ExerciseBase';
import {RequireAuth} from './users/RequireAuth';
import {ChangePasswordForm} from './users/ChangePasswordForm';
import {Rights} from './graphql';

export function App(): JSX.Element {

  const {t} = useTranslation('common');
  const currentUser = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logout(): void {
    dispatch(userLogoutAction);
    navigate(loginUrl);
  }

  return (
    <>

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

      <div className="pt-2">
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
      </div>
    </>
  );
}
