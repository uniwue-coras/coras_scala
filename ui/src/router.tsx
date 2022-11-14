import {createBrowserRouter, Outlet} from 'react-router-dom';
import {Home} from './Home';
import {RegisterForm} from './users/RegisterForm';
import {LoginForm} from './users/LoginForm';
import {CreateExercise} from './CreateExercise';
import {RequireAuth} from './users/RequireAuth';
import {ChangePasswordForm} from './users/ChangePasswordForm';
import {ClaimLti} from './users/ClaimLti';
import {NavBar} from './NavBar';
import {Rights} from './graphql';
import {ExerciseOverview} from './exercise/ExerciseOverview';
import {SubmitSolution} from './exercise/SubmitSolution';
import {NewCorrectSolutionContainer} from './exercise/NewCorrectSolutionContainer';

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
      {path: '/register', element: <RegisterForm/>},
      {path: '/login', element: <LoginForm/>},
      {path: '/lti/:ltiUuid', element: <ClaimLti/>},
      {path: '/changePassword', element: <RequireAuth>{() => <ChangePasswordForm/>}</RequireAuth>},
      //
      {path: '/', element: <RequireAuth>{(user) => <Home currentUser={user}/>}</RequireAuth>},
      {path: '/createExercise', element: <RequireAuth minimalRights={Rights.Admin}>{() => <CreateExercise/>}</RequireAuth>},
      {
        path: '/exercises',
        children: [
          {
            path: ':exId', children: [
              {index: true, element: <RequireAuth>{(user) => <ExerciseOverview currentUser={user}/>}</RequireAuth>},
              {
                path: `solutions`, children: [
                  {
                    path: 'submit', children: [
                      {index: true, element: <SubmitSolution/>},
                      {path: ':username', element: <SubmitSolution/>},
                    ]
                  },
                  {path: ':username/correctSolution', element: <NewCorrectSolutionContainer/>}
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]);
