import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {homeUrl} from '../urls';
import {ExerciseOverviewFragment, useExerciseOverviewQuery} from '../graphql';
import {WithQuery} from '../WithQuery';
import {SelectUserForSubmitForm} from './SelectUserForSubmitForm';
import {User} from '../store';

function solutionBaseUrl(exerciseId: number): string {
  return `/exercises/${exerciseId}/solutions`;
}

function submitSolutionUrl(exerciseId: number): string {
  return `${solutionBaseUrl(exerciseId)}/submit`;
}

function correctSolutionUrl(exerciseId: number, username: string): string {
  return `${solutionBaseUrl(exerciseId)}/${username}/correctSolution`;
}

function updateCorrectionUrl(exerciseId: number, username: string): string {
  return `${solutionBaseUrl(exerciseId)}/${username}/updateCorrection`;
}

interface InnerProps extends IProps {
  exerciseId: number;
  exercise: ExerciseOverviewFragment;
}

function Inner({exerciseId, currentUser, exercise}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');
  const navigate = useNavigate();

  function updateSolutionForUser(username: string): void {
    navigate(`${solutionBaseUrl(exerciseId)}/submit/${username}`);
  }

  if (!exercise) {
    return <Navigate to={homeUrl}/>;
  }

  const {title, text, solutionSubmitted, allUsersWithSolution, /* corrected, */ allUsersWithCorrection} = exercise;

  return (
    <>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>

      <div className="mt-2 p-2 rounded border border-slate-500 shadow">{text.split('\n').map((c, index) => <p key={index}>{c}</p>)}</div>

      {!solutionSubmitted && <Link to={submitSolutionUrl(exerciseId)} className="block mt-2 p-2 rounded bg-blue-500 text-white text-center">
        {t('submitSolution')}
      </Link>}

      {currentUser.rights !== 'Student' && <>
        <div className="my-5">
          <SelectUserForSubmitForm onSubmit={updateSolutionForUser}/>
        </div>

        {allUsersWithSolution && <section className="mt-5">
          <h2 className="font-bold text-xl text-center">{t('submittedSolutions')}</h2>

          <div className="grid grid-cols-6 gap-2">
            {allUsersWithSolution.map((username) => <div key={username}>
              <header className="p-2 rounded-t border border-slate-600">{username}</header>

              <footer className="p-2 border-b border-x border-slate-600">
                <Link key={text} to={correctSolutionUrl(exerciseId, username)} className="text-blue-600">{t('correctSolution')}</Link>
              </footer>

            </div>)}
          </div>

        </section>}

        {allUsersWithCorrection && <section className="mt-5">
          <h2 className="font-bold text-xl text-center">{t('submittedCorrections')}</h2>

          <div className="grid grid-cols-6 gap-2">
            {allUsersWithCorrection.map((username) => <div key={username}>
              <header className="p-2 rounded-t border border-slate-600">{username}</header>

              <footer className="p-2 border-b border-x border-slate-600">
                <Link key={text} to={updateCorrectionUrl(exerciseId, username)} className="text-blue-600">{t('updateCorrection')}</Link>
              </footer>
            </div>)}
          </div>

        </section>}
      </>}

    </>
  );
}


interface IProps {
  currentUser: User;
  //exerciseId: number;
}

export function ExerciseOverview({currentUser}: IProps): JSX.Element {

  const {exId} = useParams<{ exId: string }>();
  if (!exId) {
    return <Navigate to={homeUrl}/>;
  }
  const exerciseId = parseInt(exId);

  const exerciseOverviewQuery = useExerciseOverviewQuery({variables: {exerciseId}});

  return (
    <div className="container mx-auto">
      <WithQuery query={exerciseOverviewQuery}>
        {({exercise}) => <Inner exerciseId={exerciseId} currentUser={currentUser} exercise={exercise}/>}
      </WithQuery>
    </div>
  );
}
