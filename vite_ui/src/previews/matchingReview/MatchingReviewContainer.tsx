import { ReactElement, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MatchingReviewSolNodeFragment, useAllExerciseIdsQuery, useMatchingReviewQuery, useMatchingReviewUserSolutionQuery } from '../../graphql';
import { WithQuery } from '../../WithQuery';
import { useTranslation } from 'react-i18next';
import { MatchingReview } from './MatchingReview';
import { homeUrl } from '../../urls';
import { ExerciseIdParams } from '../../router';
import { UserNameSelector } from '../UserNameSelector';
import { ExerciseIdSelector } from '../ExerciseIdSelector';

interface InnerProps extends ExerciseIdParams {
  exerciseId: number;
  allExerciseIds: number[];
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  usernames: { username: string }[];
  setExerciseId: (exerciseId: number) => void;
}

function Inner({ exerciseId, allExerciseIds, sampleSolutionNodes, usernames, setExerciseId }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { username } = usernames[currentUserIndex];

  return (
    <div className="px-4 py-2">
      <div className="container mx-auto grid grid-cols-2 gap-2">
        <ExerciseIdSelector exerciseId={exerciseId} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} />
        <UserNameSelector currentUserIndex={currentUserIndex} setCurrentUserIndex={setCurrentUserIndex} allUsernames={usernames.map(({ username }) => username)} />
      </div>

      <WithQuery query={useMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } })}>
        {({ exercise }) => exercise?.userSolution
          ? <MatchingReview exerciseId={exerciseId} username={username} sampleSolutionNodes={sampleSolutionNodes} {...exercise.userSolution} />
          : <div className="container mx-auto">{t('loadDataError')}</div>}
      </WithQuery>
    </div>
  );
}

interface ExerciseSelectorInnerProps {
  allExerciseIds: number[];
}

function ExerciseSelectorInner({ allExerciseIds }: ExerciseSelectorInnerProps): ReactElement {

  const [exerciseId, setExerciseId] = useState(allExerciseIds[0]);

  return (
    <WithQuery query={useMatchingReviewQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <Inner exerciseId={exerciseId} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} {...exercise} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );

}

export function MatchingReviewContainer(): ReactElement {
  return (
    <WithQuery query={useAllExerciseIdsQuery()}>
      {({ exercises }) => exercises.length > 0
        ? <ExerciseSelectorInner allExerciseIds={exercises.map(({ id }) => id)} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}
