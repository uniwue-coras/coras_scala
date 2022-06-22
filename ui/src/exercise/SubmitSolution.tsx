import {WithQuery} from '../WithQuery';
import {useExerciseTaskDefinitionQuery, useSubmitSolutionMutation} from '../graphql';
import {enumerateEntries, RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {useParams} from 'react-router-dom';
import {RawSolutionForm} from '../solutionInput/RawSolutionForm';

interface IProps {
  exerciseId: number;
}

export function SubmitSolution({exerciseId}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const maybeUsername = useParams<'username'>().username;
  const exerciseTaskDefinitionQuery = useExerciseTaskDefinitionQuery({variables: {exerciseId}});
  const [submitSolution, {data, loading, error}] = useSubmitSolutionMutation();

  function onSubmit(children: RawSolutionEntry[]): void {
    const solutionAsJson = JSON.stringify(enumerateEntries(children)[0]);

    submitSolution({variables: {exerciseId, userSolution: {maybeUsername, solutionAsJson}}})
      .catch((error) => console.error(error));

  }

  const submitted = !!data?.exerciseMutations?.submitSolution;

  return (
    <div className="container mx-auto">
      <WithQuery query={exerciseTaskDefinitionQuery}>
        {(query) => <WithNullableNavigate t={query.exercise}>
          {({title, text}) => <>
            <h1 className="font-bold text-2xl text-center">{t('exercise')} {title}</h1>

            <div className="mt-2 p-2 rounded border border-slate-500">
              {text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            {submitted
              ? <div className="mt-4 p-2 rounded bg-green-500 text-white text-center">{t('solutionSubmitted')}</div>
              : <RawSolutionForm loading={loading} onSubmit={onSubmit}/>}
          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
