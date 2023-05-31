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
import {CorrectionReview} from './exercise/correctionReviwe/CorrectionReview';
import {ManageRelatedWords} from './management/ManageRelatedWords';
import {UserManagement} from './UserManagement';

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
      {path: '/userManagement', element: <RequireAuth minimalRights={Rights.Admin}>{() => <UserManagement/>}</RequireAuth>},
      // synonym / abbreviation management
      {path: '/manageSynonyms', element: <RequireAuth minimalRights={Rights.Admin}>{() => <ManageRelatedWords/>}</RequireAuth>},
      //
      {index: true, element: <RequireAuth>{(user) => <Home currentUser={user}/>}</RequireAuth>},
      {path: '/createExercise', element: <RequireAuth minimalRights={Rights.Admin}>{() => <CreateExercise/>}</RequireAuth>},
      {
        path: '/exercises',
        children: [
          {
            path: ':exId', children: [
              {index: true, element: <RequireAuth>{(user) => <ExerciseOverview currentUser={user}/>}</RequireAuth>},
              {path: 'submitSolution', element: <RequireAuth>{() => <SubmitSolution/>}</RequireAuth>},
              {path: 'solutions/:username/correctSolution', element: <RequireAuth>{() => <NewCorrectSolutionContainer/>}</RequireAuth>},
            ]
          }
        ]
      },
      {path: 'correctionReview/:correctionReviewUuid', element: <CorrectionReview/>}
    ]
  }
]);
