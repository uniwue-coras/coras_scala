import { ReactElement } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { homeUrl } from '../../urls';
import { useCorrectionReviewByUuidQuery } from '../../graphql';
import { WithQuery } from '../../WithQuery';
import { CorrectionReview } from './CorrectionReview';

export function UuidCorrectionReview(): ReactElement {

  const { uuid } = useParams<'uuid'>();

  if (uuid === undefined) {
    return <Navigate to={homeUrl} />;
  }

  const query = useCorrectionReviewByUuidQuery({ variables: { uuid } });

  return (
    <WithQuery query={query}>
      {({ reviewCorrectionByUuid }) => reviewCorrectionByUuid
        ? <CorrectionReview reviewData={reviewCorrectionByUuid} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}
