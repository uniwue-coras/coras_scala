import { ReactElement, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MatchRevSampleSolNodeFragment, useMatchingReviewQuery, useMatchingReviewUserSolutionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import { MatchingReview } from './MatchingReview';
import { homeUrl } from '../urls';
import { WithRouterParams } from '../WithRouteParams';
import { ExerciseIdParams, readExerciseIdParam } from '../router';
import { UserNameSelector } from './UserNameSelector';

interface InnerProps extends ExerciseIdParams {
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  usernames: { username: string }[];
}

function Inner({ exerciseId, sampleSolutionNodes, usernames }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { username } = usernames[currentUserIndex];

  return (
    <div className="px-4 py-2">
      <UserNameSelector {...{ exerciseId, username, currentUserIndex, setCurrentUserIndex }} maxNumber={usernames.length} />

      <WithQuery query={useMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } })}>
        {({ exercise }) => exercise?.userSolution
          ? <MatchingReview exerciseId={exerciseId} username={username} sampleSolutionNodes={sampleSolutionNodes} {...exercise.userSolution} />
          : <div className="container mx-auto">{t('loadDataErr')}</div>}
      </WithQuery>
    </div>
  );
}

function WithRouteParamsInner({ exerciseId }: ExerciseIdParams): ReactElement {
  return (
    <WithQuery query={useMatchingReviewQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <Inner exerciseId={exerciseId} {...exercise} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function MatchingReviewContainer(): ReactElement {
  return (
    <WithRouterParams readParams={readExerciseIdParam}>
      {(params) => <WithRouteParamsInner {...params} />}
    </WithRouterParams>
  );
}
