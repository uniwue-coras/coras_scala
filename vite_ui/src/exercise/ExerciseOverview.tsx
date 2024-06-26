import { Link, Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { batchUploadSolutionsUrlFragment, homeUrl, submitForeignSolutionUrlFragment } from '../urls';
import { ExerciseOverviewFragment, useExerciseOverviewQuery, Rights, useFinishExerciseMutation } from '../graphql';
import { WithQuery } from '../WithQuery';
import { User } from '../store';
import { WithRouterParams } from '../WithRouteParams';
import { ExerciseIdParams, readExerciseIdParam } from '../router';
import { executeMutation } from '../mutationHelpers';
import { CheckeredFlagIcon, RunnerIcon } from '../icons';

interface IProps {
  currentUser: User;
}

interface InnerProps extends ExerciseIdParams, IProps {
  exercise: ExerciseOverviewFragment;
}

const linkClasses = 'p-2 rounded bg-blue-500 text-white text-center';

function Inner({ exerciseId, currentUser, exercise }: InnerProps): ReactElement {

  const { title, text, isFinished, userSolutions } = exercise;

  const { t } = useTranslation('common');
  const [finishExercise] = useFinishExerciseMutation();

  const onFinishExercise = () => executeMutation(
    () => finishExercise({ variables: { exerciseId } }),
    () => void 0
  );

  return (
    <>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>
      <div className="my-4 text-justify">{text.split('\n').map((c, index) => <p key={index}>{c}</p>)}</div>

      {currentUser.rights !== Rights.Student && <>
        <div className="my-4 grid grid-cols-2 gap-2">
          <Link to={`/exercises/${exerciseId}/${submitForeignSolutionUrlFragment}`} className={linkClasses}>{t('submitSingleSolution')}</Link>
          <Link to={`/exercises/${exerciseId}/${batchUploadSolutionsUrlFragment}`} className={linkClasses}>{t('batchUploadSolutions')}</Link>
        </div>

        {currentUser.rights === Rights.Admin && <div className="text-center">
          <button type="button" className="p-2 rounded bg-cyan-500 text-white text-center disabled:opacity-50 w-full" onClick={onFinishExercise} disabled={isFinished}>{t('finishExercise')}</button>
        </div>}

        <section className="my-4">
          <h2 className="font-bold text-xl text-center">{t('submittedSolutions')}</h2>

          {userSolutions.length > 0 &&
            <div className="my-5 grid grid-cols-4 gap-2">
              {userSolutions.map(({ username, correctionFinished }) =>
                <Link className="p-2 rounded border border-slate-500 text-blue-600 text-center space-x-2 w-full" to={`/exercises/${exerciseId}/solutions/${username}/correctSolution`}>
                  <span>{username}</span>
                  <span>{correctionFinished ? <CheckeredFlagIcon /> : <RunnerIcon />}</span>
                </Link>)}
            </div>}
        </section>
      </>}
    </>
  );
}

function WithRouteParamsInner({ exerciseId, currentUser }: ExerciseIdParams & IProps): ReactElement {
  return (
    <WithQuery query={useExerciseOverviewQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <Inner {...{ exerciseId, currentUser, exercise }} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function ExerciseOverview({ currentUser }: IProps): ReactElement {
  return (
    <div className="container mx-auto py-4">
      <WithRouterParams readParams={readExerciseIdParam}>
        {({ exerciseId }) => <WithRouteParamsInner {...{ exerciseId, currentUser }} />}
      </WithRouterParams>
    </div>
  );
}
