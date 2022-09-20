import {Route, Routes} from 'react-router-dom';
import {Home} from './Home';
import {changePasswordUrl, createExerciseUrl, exercisesBaseUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {RegisterForm} from './users/RegisterForm';
import {LoginForm} from './users/LoginForm';
import {CreateExercise} from './CreateExercise';
import {ExerciseBase} from './exercise/ExerciseBase';
import {RequireAuth} from './users/RequireAuth';
import {ChangePasswordForm} from './users/ChangePasswordForm';
import {ClaimLti} from './ClaimLti';
import {NavBar} from './NavBar';
import {Rights} from './myTsModels';

export function App(): JSX.Element {
  return (
    <>
      <NavBar/>

      <Routes>
        {/* User management routes*/}
        <Route path={registerUrl} element={<RegisterForm/>}/>

        <Route path={loginUrl} element={<LoginForm/>}/>

        <Route path={'/lti/:ltiUuid'} element={<ClaimLti/>}/>

        <Route path={changePasswordUrl} element={
          <RequireAuth>
            {() => <ChangePasswordForm/>}
          </RequireAuth>
        }/>

        {/* "real" routes */}
        <Route path={homeUrl} element={
          <RequireAuth>
            {(user) => <Home currentUser={user}/>}
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
