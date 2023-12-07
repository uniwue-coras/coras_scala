import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { MatchingReviewQuery, useMatchingReviewQuery } from '../graphql';
import { WithQuery } from '../WithQuery';

interface IProps extends MatchingReviewQuery {
  exerciseId: number;
}

function Inner({ exerciseId, exercise }: IProps): ReactElement {

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl text-center">MatchingReview {exerciseId}</h1>

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
          ? <Inner exerciseId={exerciseId} exercise={exercise} />
          : <div>TODO!</div>}
    </WithQuery>
  );
}
