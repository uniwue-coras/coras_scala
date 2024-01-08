import { createBrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { RegisterForm } from './users/RegisterForm';
import { LoginForm } from './users/LoginForm';
import { CreateExercise } from './CreateExercise';
import { RequireAuth } from './users/RequireAuth';
import { ChangePasswordForm } from './users/ChangePasswordForm';
import { ClaimLti } from './users/ClaimLti';
import { Rights } from './graphql';
import { ExerciseOverview } from './exercise/ExerciseOverview';
import { SubmitForeignSolution } from './exercise/SubmitForeignSolution';
import { CorrectSolutionContainer } from './exercise/CorrectSolutionContainer';
import { CorrectionReviewContainer } from './exercise/correctionReview/CorrectionReviewContainer';
import { ManageRelatedWords } from './management/ManageRelatedWords';
import { AbbreviationManagement } from './management/AbbreviationManagement';
import { UserManagement } from './UserManagement';
import { UuidCorrectionReview } from './exercise/correctionReview/UuidCorrectionReview';
import { SubmitOwnSolution } from './student/SubmitOwnSolution';
import { MatchingReviewContainer } from './matchingReview/MatchingReviewContainer';
import { App } from './App';
import {
  abbreviationManagementUrl,
  changePasswordUrl,
  loginUrl,
  registerUrl,
  relatedWordManagementUrl,
  reviewCorrectionUrlFragment,
  submitForeignSolutionUrlFragment,
  submitOwnSolutionUrlFragment,
  userManagementUrl
} from './urls';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // User management
      { path: '/lti/:ltiUuid', element: <ClaimLti /> },
      { path: registerUrl, element: <RegisterForm /> },
      { path: loginUrl, element: <LoginForm /> },
      { path: changePasswordUrl, element: <RequireAuth>{() => <ChangePasswordForm />}</RequireAuth> },
      { path: userManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <UserManagement />}</RequireAuth> },
      // related words management
      { path: abbreviationManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <AbbreviationManagement />}</RequireAuth> },
      { path: relatedWordManagementUrl, element: <RequireAuth minimalRights={Rights.Admin}>{() => <ManageRelatedWords />}</RequireAuth> },
      //
      { index: true, element: <RequireAuth>{(user) => <Home currentUser={user} />}</RequireAuth> },
      { path: '/createExercise', element: <RequireAuth minimalRights={Rights.Admin}>{() => <CreateExercise />}</RequireAuth> },
      {
        path: '/exercises',
        children: [
          {
            path: ':exId', children: [
              { index: true, element: <RequireAuth>{(user) => <ExerciseOverview currentUser={user} />}</RequireAuth> },
              { path: submitOwnSolutionUrlFragment, element: <RequireAuth>{(currentUser) => <SubmitOwnSolution user={currentUser} />}</RequireAuth> },
              { path: submitForeignSolutionUrlFragment, element: <RequireAuth>{() => <SubmitForeignSolution />}</RequireAuth> },
              { path: reviewCorrectionUrlFragment, element: <RequireAuth>{() => <CorrectionReviewContainer />}</RequireAuth> },
              { path: 'solutions/:username/correctSolution', element: <RequireAuth>{() => <CorrectSolutionContainer />}</RequireAuth> },
            ]
          }
        ]
      },
      // is this still relevant?
      { path: 'correctionReview/:uuid', element: <UuidCorrectionReview /> },
      { path: 'matchingReview/:exId', element: <MatchingReviewContainer onlyParagraphMatching={false} /> },
      { path: 'paragraphMatchingReview/:exId', element: <MatchingReviewContainer onlyParagraphMatching={true} /> }
    ]
  }
]);
