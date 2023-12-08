import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchRevSampleSolNodeFragment, useMatchingReviewQuery, useMatchingReviewUserSolutionQuery } from '../graphql';
import { WithQuery } from '../WithQuery';
import { MatchingReviewSolutionDisplay } from './MatchingReviewSolutionDisplay';

interface IProps {
  exerciseId: number;
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  usernames: { username: string }[];
}

function Inner({ exerciseId, sampleSolutionNodes, usernames }: IProps): ReactElement {

  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const username = usernames[currentUserIndex].username;

  const query = useMatchingReviewUserSolutionQuery({ variables: { exerciseId, username } });

  return (
    <div className="container mx-auto">
      <h1 className="my-4 text-2xl text-center">MatchingReview {exerciseId} - {username}</h1>

      <div className="my-4 grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-50" disabled={currentUserIndex <= 0}
          onClick={() => setCurrentUserIndex((index) => index - 1)}>
          previous
        </button>
        <button type="button" className="p-2 rounded bg-blue-500 text-white disabled:opacity-60" disabled={currentUserIndex >= usernames.length - 1}
          onClick={() => setCurrentUserIndex((index) => index + 1)}>
          next
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <MatchingReviewSolutionDisplay nodes={sampleSolutionNodes} />
        </div>

        <WithQuery query={query}>
          {(data) =>
            data.exercise?.userSolution
              ? <MatchingReviewSolutionDisplay nodes={data.exercise.userSolution.nodes} />
              : <div>TODO!</div>}
        </WithQuery>
      </div>

    </div>
  );
}

export function MatchingReview(): ReactElement {

  const exerciseId = parseInt(useParams<'exId'>().exId || '0');

  const query = useMatchingReviewQuery({ variables: { exerciseId } });

  return (
    <WithQuery query={query}>
      {({ exercise }) =>
        exercise
          ? <Inner exerciseId={exerciseId} {...exercise} />
          : <div>TODO!</div>}
    </WithQuery>
  );
}
