import {WithQuery} from '../WithQuery';
import {useSubmitSolutionQuery} from '../graphql';
import {enumerateEntries, RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {INewUserSolutionInput} from '../myTsModels';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {useParams} from 'react-router-dom';
import {RawSolutionForm} from '../solutionInput/RawSolutionForm';
import useAxios from 'axios-hooks';

interface IProps {
  exerciseId: number;
}

export function SubmitSolution({exerciseId}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const username = useParams<'username'>().username;

  const submitSolutionQuery = useSubmitSolutionQuery({variables: {exerciseId}});
  /*const [submitSolutionForUser, {data, loading, error}] = useSubmitSolutionForUserMutation();*/

  const [{data,loading, error}, executeSubmitSolution] = useAxios<any, INewUserSolutionInput>({
    url: `/exercises/${exerciseId}/solutions`,
    headers: {'Content-Type': 'application/json'},
    method: 'post'
  }, {manual: true});

  function onSubmit(children: RawSolutionEntry[]): void {
    /*
    const solution: SubmitSolutionInput = {
      username,
      solution: flattenEntries(
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (rest, id, parentId) => ({id, parentId, ...rest})
      )[0]
    };

    submitSolutionForUser({variables: {exerciseId, solution}})
      .catch((error) => console.error(error));
     */

    executeSubmitSolution({
      data: {maybeUsername: username, solution: enumerateEntries(children)[0]}
    });
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

            <RawSolutionForm loading={loading} onSubmit={onSubmit}/>
          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
