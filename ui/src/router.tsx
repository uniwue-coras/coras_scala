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
import {AbbreviationManagement} from './management/AbbreviationManagement';
import {UserManagement} from './UserManagement';
import {abbreviationManagementUrl, changePasswordUrl, loginUrl, registerUrl, relatedWordManagementUrl, userManagementUrl} from './urls';

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
      {path: '/lti/:ltiUuid', element: <ClaimLti/>},
      {path: registerUrl, element: <RegisterForm/>},
      {path: loginUrl, element: <LoginForm/>},
      {path: changePasswordUrl, element: <RequireAuth>{() => <ChangePasswordForm/>}</RequireAuth>},
      {path: userManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <UserManagement/>}</RequireAuth>},
      // related words management
      {path: abbreviationManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <AbbreviationManagement/>}</RequireAuth>},
      {path: relatedWordManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <ManageRelatedWords/>}</RequireAuth>},
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
