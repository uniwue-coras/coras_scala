import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {correctUrlFragment, exercisesBaseUrl, solutionsUrlFragment, submitUrlFragment} from '../urls';
import {LoginResultFragment, Rights, useExerciseOverviewQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {BulmaCard} from '../bulmaHelpers/BulmaCard';
import {WithNullableNavigate} from '../WithNullableNavigate';
import {SelectUserForSubmitForm} from './SelectUserForSubmitForm';

interface IProps {
  currentUser: LoginResultFragment;
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
    <div className="container">
      <WithQuery query={exerciseOverviewQuery}>
        {(query) => <WithNullableNavigate t={query.exercise}>
          {({title, text, solutionSubmitted, allUsersWithSolution}) => <>
            <h1 className="title is-3 has-text-centered">{t('exercise')} &quot;{title}&quot;</h1>

            <div className="box">{text.split('\n').map((c, index) => <p key={index}>{c}</p>)}</div>

            {!solutionSubmitted &&
            <Link to={`${exercisesBaseUrl}/${exerciseId}/${solutionsUrlFragment}/${submitUrlFragment}`} className="button is-link is-fullwidth">
              {t('submitSolution')}
            </Link>}

            {currentUser.rights !== Rights.Student && <>
              <div className="my-5">
                <SelectUserForSubmitForm onSubmit={updateSolutionForUser}/>
              </div>

              {allUsersWithSolution && <section className="mt-5">
                <h2 className="subtitle is-3 has-text-centered">{t('submittedSolutions')}</h2>

                <div className="columns is-multiline">
                  {allUsersWithSolution.map((username) => <div className="column is-one-fifth" key={username}>
                    <BulmaCard title={username} links={[{text: t('correctSolution'), to: correctSolutionUrl(exerciseId, username)}]}/>
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
