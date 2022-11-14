import {useClaimJwtMutation} from '../graphql';
import {Navigate, useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {homeUrl} from '../urls';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, login} from '../store';

export function ClaimLti() {

  const {ltiUuid} = useParams<'ltiUuid'>();
  const dispatch = useDispatch();
  const [claimLtiWebToken] = useClaimJwtMutation();

  if (!ltiUuid) {
    return <Navigate to={homeUrl}/>;
  }

  useEffect(() => {
    claimLtiWebToken({variables: {ltiUuid}})
      .then(({data}) => data?.claimJwt && dispatch(login(data.claimJwt)))
      .catch((error) => console.error(error));
  }, []);

  if (useSelector(currentUserSelector)) {
    return <Navigate to={homeUrl}/>;
  }

  return (
    <div className="container mx-auto">
      <p className="text-center">Performing login...</p>
    </div>
  );
}
