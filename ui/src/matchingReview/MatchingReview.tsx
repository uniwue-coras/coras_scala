import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { useMatchingReviewQuery, MatchingReviewDataFragment } from '../graphql';
import { WithQuery } from '../WithQuery';

interface IProps {
  matchingReviewData: MatchingReviewDataFragment;
}

function Inner({ matchingReviewData }: IProps): ReactElement {
  return (
    <pre>
      {JSON.stringify(matchingReviewData, null, 2)}
    </pre>
  );
}

export function MatchingReview(): ReactElement {

  const exerciseId = parseInt(useParams<'exId'>().exId || '0');

  const query = useMatchingReviewQuery({ variables: { exerciseId } });

  console.info(exerciseId);

  return (
    <div className="container mx-auto">

      <WithQuery query={query}>
        {({ exercise }) =>
          exercise
            ? <Inner matchingReviewData={exercise} />
            : <div>TODO!</div>}
      </WithQuery>
    </div>
  );
}
