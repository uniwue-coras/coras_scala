import {Navigate, Route, Routes, useParams} from 'react-router-dom';
import {correctUrlFragment, homeUrl, solutionsUrlFragment, submitUrlFragment} from '../urls';
import {ExerciseOverview} from './ExerciseOverview';
import {SubmitSolution} from './SubmitSolution';
import {CorrectSolutionContainer} from './CorrectSolution';
import {ILoginResult} from '../myTsModels';

interface IProps {
  currentUser: ILoginResult;
}

export function ExerciseBase({currentUser}: IProps): JSX.Element {

  const {exId} = useParams<'exId'>();

  if (!exId) {
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  return (
    <Routes>
      <Route path={'/'} element={<ExerciseOverview exerciseId={exerciseId} currentUser={currentUser}/>}/>

      <Route path={`/${solutionsUrlFragment}/${submitUrlFragment}`} element={<SubmitSolution exerciseId={exerciseId}/>}/>
      <Route path={`/${solutionsUrlFragment}/${submitUrlFragment}/:username`} element={<SubmitSolution exerciseId={exerciseId}/>}/>

      <Route path={`/${solutionsUrlFragment}/:username/${correctUrlFragment}`} element={<CorrectSolutionContainer exerciseId={exerciseId}/>}/>
    </Routes>
  );
}

