import {WithQuery} from '../WithQuery';
import {SubmitSolutionForm} from './SubmitSolutionForm';
import {FlatSolutionEntryInput, useSubmitSolutionForUserMutation, useSubmitSolutionQuery, useSubmitUserSolutionMutation} from '../graphql';
import {AnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {flattenEntries} from '../solutionInput/treeNode';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {useParams} from 'react-router-dom';

interface IProps {
  exerciseId: number;
}

export function SubmitSolution({exerciseId}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const username = useParams<'username'>().username;
  const submitSolutionQuery = useSubmitSolutionQuery({variables: {exerciseId}});
  const [submitUserSolution, {data, loading, error}] = useSubmitUserSolutionMutation();
  const [submitSolutionForUser, {data: data2, loading: loading2, error: error2}] = useSubmitSolutionForUserMutation();

  console.info(username);

  function onSubmit(children: AnalyzedSolutionEntry[]): void {
    const solution: FlatSolutionEntryInput[] = flattenEntries(
      children,
      ({otherNumber, ...rest}, id, parentId) => ({id, parentId, ...rest})
    )[0];

    console.info(username);

    username
      ? submitSolutionForUser({variables: {exerciseId, solution, username}})
        .catch((error) => console.error(error))
      : submitUserSolution({variables: {exerciseId, solution}})
        .catch((error) => console.error(error));
  }

  const submitted = username
    ? !!data2?.exerciseMutations?.submitSolutionForUser
    : !!data?.exerciseMutations?.submitUserSolution;

  return (
    <div className="container">
      <WithQuery query={submitSolutionQuery}>
        {(query) => <WithNullableNavigate t={query.exercise}>
          {({title, text}) => <>
            <h1 className="title is-3 has-text-centered">{t('exercise')} {title}</h1>

            <div className="box">
              {text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}
            {error2 && <div className="notification is-danger has-text-centered">{error2.message}</div>}

            {submitted && <div className="notification is-success has-text-centered">{t('solutionSubmitted')}</div>}

            <SubmitSolutionForm onSubmit={onSubmit} loading={loading || loading2}/>
          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
