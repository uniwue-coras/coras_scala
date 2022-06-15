import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {correctUrlFragment, exercisesBaseUrl, solutionsUrlFragment, submitUrlFragment} from '../urls';
import {Rights, useExerciseOverviewQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {SelectUserForSubmitForm} from './SelectUserForSubmitForm';
import {ILoginResult} from '../myTsModels';

interface IProps {
  currentUser: ILoginResult;
  exerciseId: number;
}

function correctSolutionUrl(exerciseId: number, username: string): string {
  return `${exercisesBaseUrl}/${exerciseId}/${solutionsUrlFragment}/${username}/${correctUrlFragment}`;
}

export function ExerciseOverview({currentUser, exerciseId}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const exerciseOverviewQuery = useExerciseOverviewQuery({variables: {exerciseId}});
  const navigate = useNavigate();

  function updateSolutionForUser(username: string): void {
    console.info('TODO!');
    navigate(`${exercisesBaseUrl}/${exerciseId}/${solutionsUrlFragment}/${submitUrlFragment}/${username}`);
  }

  return (
    <div className="container mx-auto">
      <WithQuery query={exerciseOverviewQuery}>
        {(query) => <WithNullableNavigate t={query.exercise}>
          {({title, text, solutionSubmitted, allUsersWithSolution}) => <>
            <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>

            <div className="mt-2 p-2 rounded border border-slate-500 shadow">{text.split('\n').map((c, index) => <p key={index}>{c}</p>)}</div>

            {!solutionSubmitted &&
              <Link to={`${exercisesBaseUrl}/${exerciseId}/${solutionsUrlFragment}/${submitUrlFragment}`} className="block mt-2 p-2 rounded bg-blue-500 text-white text-center">
                {t('submitSolution')}
              </Link>}

            {currentUser.rights !== Rights.Student && <>
              <div className="my-5">
                <SelectUserForSubmitForm onSubmit={updateSolutionForUser}/>
              </div>

              {allUsersWithSolution && <section className="mt-5">
                <h2 className="font-bold text-xl text-center">{t('submittedSolutions')}</h2>

                <div className="grid grid-cols-6 gap-2">
                  {allUsersWithSolution.map((username) => <div key={username}>
                    <header className="p-2 rounded-t border border-slate-600">{username}</header>

                    <footer className="p-2 border-l border-b border-r border-slate-600">
                      <Link key={text} to={correctSolutionUrl(exerciseId, username)} className="text-blue-600">{t('correctSolution')}</Link>
                    </footer>

                  </div>)}
                </div>
              </section>}
            </>}

          </>}
        </WithNullableNavigate>}
      </WithQuery>
    </div>
  );
}
