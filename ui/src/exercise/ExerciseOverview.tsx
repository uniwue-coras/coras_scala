import {Link, Navigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {homeUrl} from '../urls';
import {CorrectionStatus, ExerciseOverviewFragment, useExerciseOverviewQuery, useInitiateCorrectionMutation} from '../graphql';
import {WithQuery} from '../WithQuery';
import {User} from '../store';

interface InnerProps extends IProps {
  exerciseId: number;
  exercise: ExerciseOverviewFragment;
  update: () => void;
}

function Inner({exerciseId, currentUser, exercise, update}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');
  const {title, text, userSolutions} = exercise;

  const [initiateCorrection] = useInitiateCorrectionMutation();

  const onInitiateCorrection = (username: string): void => {
    // TODO: don't reload, use state!
    initiateCorrection({variables: {username, exerciseId}})
      .then(() => update());
  };

  return (
    <div>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>

      <div className="mt-2 p-2 rounded border border-slate-500 shadow">
        {text.split('\n').map((c, index) => <p key={index}>{c}</p>)}
      </div>

      {currentUser.rights !== 'Student' && <div>
        <Link className="my-5 block p-2 rounded bg-blue-500 text-white text-center w-full" to={`/exercises/${exerciseId}/submitSolution`}>
          {t('submitSolution')}
        </Link>

        {userSolutions && <section className="mt-5">
          <h2 className="font-bold text-xl text-center">{t('submittedSolutions')}</h2>

          <div className="my-5 grid grid-cols-6 gap-2">
            {userSolutions.map(({username, correctionStatus}) => <div key={username}>
              <header className="p-2 rounded-t border border-slate-600">{username}</header>

              <footer className="p-2 border-b border-x border-slate-600">
                {correctionStatus === CorrectionStatus.Waiting
                  ? <button type="button" onClick={() => onInitiateCorrection(username)}>{t('initiateCorrection')}</button>
                  : <Link key={text} className="text-blue-600"
                          to={`/exercises/${exerciseId}/solutions/${username}/correctSolution`}>{t('correctSolution')}</Link>}
              </footer>

            </div>)}
          </div>

        </section>}
      </div>}
    </div>
  );
}


interface IProps {
  currentUser: User;
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
        {({exercise}) => <Inner exerciseId={exerciseId} currentUser={currentUser} exercise={exercise} update={() => exerciseOverviewQuery.refetch()}/>}
      </WithQuery>
    </div>
  );
}
