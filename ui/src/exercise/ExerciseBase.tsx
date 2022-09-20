import {Navigate, Route, Routes, useParams} from 'react-router-dom';
import {correctSolutionUrlFragment, homeUrl, solutionsUrlFragment, submitUrlFragment, updateCorrectionUrlFragment} from '../urls';
import {ExerciseOverview} from './ExerciseOverview';
import {SubmitSolution} from './SubmitSolution';
import {CorrectSolutionContainer} from './CorrectSolution';
import {UpdateCorrectionContainer} from './UpdateCorrection';
import {NewCorrectSolutionContainer} from './NewCorrectSolutionContainer';
import {User} from '../newStore';

interface IProps {
  currentUser: User;
}

export function ExerciseBase({currentUser}: IProps): JSX.Element {

  const {exId} = useParams<'exId'>();

  if (!exId) {
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  return (
    <Routes>
      <Route index element={<ExerciseOverview exerciseId={exerciseId} currentUser={currentUser}/>}/>

      <Route path={`/${solutionsUrlFragment}`}>

        <Route path={submitUrlFragment}>
          <Route index element={<SubmitSolution exerciseId={exerciseId}/>}/>
          <Route path={':username'} element={<SubmitSolution exerciseId={exerciseId}/>}/>
        </Route>

        <Route path={':username'}>
          <Route path={'newCorrectSolution'} element={<NewCorrectSolutionContainer exerciseId={exerciseId}/>}/>
          <Route path={correctSolutionUrlFragment} element={<CorrectSolutionContainer exerciseId={exerciseId}/>}/>
          <Route path={updateCorrectionUrlFragment} element={<UpdateCorrectionContainer exerciseId={exerciseId}/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

