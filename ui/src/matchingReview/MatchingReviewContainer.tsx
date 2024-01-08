import { ReactElement, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { SolutionNodeFragment, useMatchingReviewQuery, useMatchingReviewUserSolutionQuery, useParagraphMatchingReviewUserSolutionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { useTranslation } from 'react-i18next';
import { MatchingReview } from './MatchingReview';
import { homeUrl } from '../urls';

interface IProps {
  onlyParagraphMatching: boolean;
}

interface InnerProps extends IProps {
  exerciseId: number;
  sampleSolutionNodes: SolutionNodeFragment[];
  usernames: { username: string }[];
}

function Inner({ exerciseId, sampleSolutionNodes, usernames, onlyParagraphMatching }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const username = usernames[currentUserIndex].username;

  const query = onlyParagraphMatching
    ? useParagraphMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } })
    : useMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } });

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
            ? <MatchingReview sampleSolutionNodes={sampleSolutionNodes} {...data.exercise.userSolution} />
            : <div className="container mx-auto">{t('loadDataError!')}</div>}
        </WithQuery>
      </div>
    </div>
  );
}

export function MatchingReviewContainer({ onlyParagraphMatching }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const { exId } = useParams<'exId'>();

  if (exId === undefined) {
    return <Navigate to={homeUrl} />;
  }

  const exerciseId = parseInt(exId);

  const query = useMatchingReviewQuery({ variables: { exerciseId } });

  return (
    <WithQuery query={query}>
      {({ exercise }) =>
        exercise
          ? <Inner exerciseId={exerciseId} onlyParagraphMatching={onlyParagraphMatching} {...exercise} />
          : <div className="container mx-auto">{t('loadDataError!')}</div>}
    </WithQuery>
  );
}
