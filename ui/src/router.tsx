import {createBrowserRouter, Outlet} from 'react-router-dom';
import {Home} from './Home';
import {changePasswordUrl, createExerciseUrl, exercisesBaseUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {RegisterForm} from './users/RegisterForm';
import {LoginForm} from './users/LoginForm';
import {CreateExercise} from './CreateExercise';
import {ExerciseBase} from './exercise/ExerciseBase';
import {RequireAuth} from './users/RequireAuth';
import {ChangePasswordForm} from './users/ChangePasswordForm';
import {ClaimLti} from './users/ClaimLti';
import {NavBar} from './NavBar';
import {Rights} from './graphql';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavBar/>
        <Outlet/>
      </>
    ),
    children: [
      // User management
      {path: registerUrl, element: <RegisterForm/>},
      {path: loginUrl, element: <LoginForm/>},
      {path: '/lti/:ltiUuid', element: <ClaimLti/>},
      {path: changePasswordUrl, element: <RequireAuth>{() => <ChangePasswordForm/>}</RequireAuth>},
      //
      {path: homeUrl, element: <RequireAuth>{(user) => <Home currentUser={user}/>}</RequireAuth>},
      {path: createExerciseUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <CreateExercise/>}</RequireAuth>},
      {path: `${exercisesBaseUrl}/:exId/*`, element: <RequireAuth>{(user) => <ExerciseBase currentUser={user}/>}</RequireAuth>}
    ]
  }
]);
