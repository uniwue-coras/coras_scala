import { ReactElement } from 'react';
import { User } from '../store';
import { Navigate, useParams } from 'react-router-dom';
import { homeUrl } from '../urls';
import { RawSolutionForm } from '../solutionInput/RawSolutionForm';
import { useTranslation } from 'react-i18next';
import { SolutionNodeInput, useSubmitSolutionMutation } from '../graphql';
import { executeMutation } from '../mutationHelpers';

interface IProps {
  user: User;
}

export function SubmitOwnSolution({ user }: IProps): ReactElement {

  const { exId } = useParams<'exId'>();
  const { t } = useTranslation('common');
  const [submitSolution, { data, loading, error }] = useSubmitSolutionMutation();

  if (exId === undefined) {
    return <Navigate to={homeUrl} />;
  }

  const exerciseId = parseInt(exId);

  const onSubmit = (solution: SolutionNodeInput[]): Promise<void> => executeMutation(
    () => submitSolution({ variables: { exerciseId, userSolution: { username: user.username, solution } } })
  );

  return (
    <div className="container mx-auto">
      <h1 className="my-4 font-bold text-center text-2xl">{t('submitOwnSolution')}</h1>

      {error && <div className="p-2 bg-red-500 text-white text-center">{error.message}</div>}

      {data?.exerciseMutations?.submitSolution
        ? <div className="p-2 rounded bg-green-500 text-white text-center w-full">{t('solutionSuccessfullySubmitted')}</div>
        : <RawSolutionForm loading={loading} onSubmit={onSubmit} />}
    </div>
  );
}
