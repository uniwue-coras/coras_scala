import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { homeUrl } from '../../urls';
import { useCorrectionReviewByUuidQuery } from '../../graphql';
import { WithQuery } from '../../WithQuery';
import { CorrectionReview } from './CorrectionReview';
import { WithRouterParams } from '../../WithRouteParams';
import { readUuidParam } from '../../router';

interface IProps {
  uuid: string;
}

function Inner({ uuid }: IProps): ReactElement {
  return (
    <WithQuery query={useCorrectionReviewByUuidQuery({ variables: { uuid } })}>
      {({ reviewCorrectionByUuid }) => reviewCorrectionByUuid
        ? <CorrectionReview reviewData={reviewCorrectionByUuid} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}


export function UuidCorrectionReview(): ReactElement {
  return (
    <WithRouterParams readParams={readUuidParam}>
      {(uuid) => uuid !== undefined
        ? <Inner uuid={uuid} />
        : <Navigate to={homeUrl} />}
    </WithRouterParams>
  );
}
