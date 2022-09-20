import {useClaimJwtMutation} from './graphql';
import {Navigate, useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {homeUrl} from './urls';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, login} from './newStore';

export function ClaimLti() {

  const ltiUuid = useParams<'ltiUuid'>().ltiUuid;
  const dispatch = useDispatch();
  const [claimLtiWebToken] = useClaimJwtMutation();

  if (!ltiUuid) {
    return <Navigate to={homeUrl}/>;
  }

  useEffect(() => {
    claimLtiWebToken({variables: {ltiUuid}})
      .then(({data}) => {
        console.info(data);
        data && data.claimJwt && dispatch(login(data.claimJwt));
      })
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
