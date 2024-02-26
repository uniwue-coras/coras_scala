import { Link, Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { homeUrl, submitForeignSolutionUrlFragment } from '../urls';
import { ExerciseOverviewFragment, useExerciseOverviewQuery, useInitiateCorrectionMutation } from '../graphql';
import { WithQuery } from '../WithQuery';
import { User } from '../store';
import { UserSolutionOverviewBox } from './UserSolutionOverviewBox';
import { WithRouterParams } from '../WithRouteParams';
import { ExerciseIdParams, readExerciseIdParam } from '../router';

interface IProps {
  currentUser: User;
}

interface InnerProps extends ExerciseIdParams, IProps {
  exercise: ExerciseOverviewFragment;
  update: () => void;
}

function Inner({ exerciseId, currentUser, exercise, update }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const { title, text, userSolutions } = exercise;

  const [initiateCorrection] = useInitiateCorrectionMutation();

  const onInitiateCorrection = async (username: string): Promise<void> => {
    await initiateCorrection({ variables: { username, exerciseId } });
    update();
  };

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>

      <div className="mt-2 p-2 rounded border border-slate-500 shadow">
        {text.split('\n').map((c, index) => <p key={index}>{c}</p>)}
      </div>

      {currentUser.rights !== 'Student' && <div>
        <Link className="my-5 block p-2 rounded bg-blue-500 text-white text-center w-full" to={`/exercises/${exerciseId}/${submitForeignSolutionUrlFragment}`}>
          {t('submitSolution')}
        </Link>

        {userSolutions && <section className="mt-5">
          <h2 className="font-bold text-xl text-center">{t('submittedSolutions')}</h2>

          <div className="my-5 grid grid-cols-4 gap-2">
            {userSolutions.map(({ username, correctionStatus }) =>
              <UserSolutionOverviewBox key={username} username={username} exerciseId={exerciseId} onInitiateCorrection={() => onInitiateCorrection(username)}
                correctionStatus={correctionStatus} />
            )}
          </div>

        </section>}
      </div>}
    </div>
  );
}

function WithRouteParamsInner({ exerciseId, currentUser }: ExerciseIdParams & IProps): ReactElement {
  return (
    <WithQuery query={useExerciseOverviewQuery({ variables: { exerciseId } })}>
      {({ exercise }, refetch) => exercise
        ? <Inner {...{ exerciseId, currentUser, exercise }} update={refetch} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function ExerciseOverview({ currentUser }: IProps): ReactElement {
  return (
    <div className="container mx-auto">
      <WithRouterParams readParams={readExerciseIdParam}>
        {({ exerciseId }) => <WithRouteParamsInner {...{ exerciseId, currentUser }} />}
      </WithRouterParams>
    </div>
  );
}
