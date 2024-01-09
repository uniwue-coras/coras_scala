import { ReactElement } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { homeUrl } from '../../urls';
import { WithQuery } from '../../WithQuery';
import { useCorrectionReviewQuery } from '../../graphql';
import { CorrectionReview } from './CorrectionReview';

export function CorrectionReviewContainer(): ReactElement {

  const { exId } = useParams<'exId'>();

  if (exId === undefined) {
    return <Navigate to={homeUrl} />;
  }

  const exerciseId = parseInt(exId);

  const query = useCorrectionReviewQuery({ variables: { exerciseId } });

  return (
    <WithQuery query={query}>
      {({ reviewCorrection }) => <CorrectionReview reviewData={reviewCorrection} />}
    </WithQuery>
  );
}
