import { useClaimJwtMutation } from '../graphql';
import { Navigate } from 'react-router-dom';
import { ReactElement, useEffect } from 'react';
import { homeUrl } from '../urls';
import { useDispatch, useSelector } from 'react-redux';
import { currentUserSelector, login } from '../store';
import { executeMutation } from '../mutationHelpers';
import { ParamReturnType, WithRouterParams } from '../WithRouteParams';

interface IProps {
  ltiUuid: string;
}

function Inner({ ltiUuid }: IProps): ReactElement {

  const dispatch = useDispatch();
  const [claimLtiWebToken] = useClaimJwtMutation();

  useEffect(() => {
    executeMutation(
      () => claimLtiWebToken({ variables: { ltiUuid } }),
      ({ claimJwt }) => claimJwt && dispatch(login(claimJwt))
    );
  }, [claimLtiWebToken, dispatch, ltiUuid]);

  if (useSelector(currentUserSelector)) {
    return <Navigate to={homeUrl} />;
  }

  return (
    <div className="container mx-auto">
      <p className="text-center">Performing login...</p>
    </div>
  );
}

export function ClaimLti(): ReactElement {
  return (
    <WithRouterParams readParams={({ ltiUuid }: ParamReturnType<'ltiUuid'>) => ltiUuid}>
      {(ltiUuid) => <Inner ltiUuid={ltiUuid} />}
    </WithRouterParams>
  );
}
