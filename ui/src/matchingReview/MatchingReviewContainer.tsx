import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchRevSampleSolNodeFragment, useMatchingReviewQuery, useMatchingReviewUserSolutionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import { MatchingReview } from './MatchingReview';

interface IProps {
  exerciseId: number;
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  usernames: { username: string }[];
}

function Inner({ exerciseId, sampleSolutionNodes, usernames }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const username = usernames[currentUserIndex].username;

  const query = useMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } });

  return (
    <div className="px-4 py-2">
      <div className="container mx-auto my-4 grid grid-cols-3 gap-2">
        <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-50" disabled={currentUserIndex <= 0}
          onClick={() => setCurrentUserIndex((index) => index - 1)}>
          previous
        </button>
        <div className="p-2 font-bold text-center">
          {exerciseId} - {username} ({currentUserIndex + 1} / {usernames.length})
        </div>
        <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-60" disabled={currentUserIndex >= usernames.length - 1}
          onClick={() => setCurrentUserIndex((index) => index + 1)}>
          next
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <WithQuery query={query}>
          {(data) => data.exercise?.userSolution
            ? <MatchingReview sampleSolutionNodes={sampleSolutionNodes} userSolution={data.exercise.userSolution} />
            : <div className="container mx-auto">{t('loadDataError!')}</div>}
        </WithQuery>
      </div>
    </div>
  );
}

export function MatchingReviewContainer(): ReactElement {

  const exerciseId = parseInt(useParams<'exId'>().exId || '0');

  const { t } = useTranslation('common');
  const query = useMatchingReviewQuery({ variables: { exerciseId } });

  return (
    <WithQuery query={query}>
      {({ exercise }) =>
        exercise
          ? <Inner exerciseId={exerciseId} {...exercise} />
          : <div className="container mx-auto">{t('loadDataError!')}</div>}
    </WithQuery>
  );
}
