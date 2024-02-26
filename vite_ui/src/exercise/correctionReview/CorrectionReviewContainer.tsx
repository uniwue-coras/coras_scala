import { ReactElement } from 'react';
import { WithQuery } from '../../WithQuery';
import { useCorrectionReviewQuery } from '../../graphql';
import { CorrectionReview } from './CorrectionReview';
import { WithRouterParams } from '../../WithRouteParams';
import { readExerciseIdParam } from '../../router';

interface IProps {
  exerciseId: number;
}

function Inner({ exerciseId }: IProps): ReactElement {
  return (
    <WithQuery query={useCorrectionReviewQuery({ variables: { exerciseId } })}>
      {({ reviewCorrection }) => <CorrectionReview reviewData={reviewCorrection} />}
    </WithQuery>
  );
}

export function CorrectionReviewContainer(): ReactElement {
  return (
    <WithRouterParams readParams={readExerciseIdParam}>
      {(params) => <Inner {...params} />}
    </WithRouterParams>
  );
}
