import {WithQuery} from '../WithQuery';
import {SubmitSolutionInput, useSubmitSolutionForUserMutation, useSubmitSolutionQuery,} from '../graphql';
import {AnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {flattenEntries} from '../solutionInput/treeNode';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {useParams} from 'react-router-dom';
import {RawSolutionForm} from '../solutionInput/RawSolutionForm';

interface IProps {
  exerciseId: number;
}

export function SubmitSolution({exerciseId}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const username = useParams<'username'>().username;
  const submitSolutionQuery = useSubmitSolutionQuery({variables: {exerciseId}});
  const [submitSolutionForUser, {data, loading, error}] = useSubmitSolutionForUserMutation();


  function onSubmit(children: AnalyzedSolutionEntry[]): void {
    const solution: SubmitSolutionInput = {
      username,
      solution: flattenEntries(
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({otherNumber, ...rest}, id, parentId) => ({id, parentId, ...rest})
      )[0]
    };

    submitSolutionForUser({variables: {exerciseId, solution}})
      .catch((error) => console.error(error));
  }

  const submitted = !!data?.exerciseMutations?.submitSolution;

  return (
    <div className="container mx-auto">
      <WithQuery query={submitSolutionQuery}>
        {(query) => <WithNullableNavigate t={query.exercise}>
          {({title, text}) => <>
            <h1 className="font-bold text-2xl text-center">{t('exercise')} {title}</h1>

            <div className="mt-2 p-2 rounded border border-slate-500">
              {text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            {submitted && <div className="notification is-success has-text-centered">{t('solutionSubmitted')}</div>}

            <RawSolutionForm onSubmit={onSubmit}/>
          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
