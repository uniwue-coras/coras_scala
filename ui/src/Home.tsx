import {WithQuery} from './WithQuery';
import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CorrectionStatus, ExerciseIdentifierFragment, Rights, SolutionIdentifierFragment, useHomeQuery} from './graphql';
import {User} from './store';

interface InnerProps extends IProps {
  exercises: ExerciseIdentifierFragment[];
  mySolutions: SolutionIdentifierFragment[];
}

function Inner({currentUser, exercises, mySolutions}: InnerProps): JSX.Element {

  const {t} = useTranslation('common');

  return (
    <>
      {currentUser.rights !== Rights.Student && <div>
        <h1 className="font-bold text-2xl text-center">{t('exercise_plural')}</h1>
        {exercises.length === 0
          ? <div className="my-2 p-2 rounded bg-cyan-400 text-white text-center">{t('noExercisesFound')}</div>
          : (
            <div className="my-2 grid grid-cols-4 gap-2">
              {exercises.map(({id, title}) => <Link key={id} to={`/exercises/${id}`} className="p-2 rounded border border-slate-600 text-center w-full">
                {id}: {title}
              </Link>)}
            </div>
          )}

        {currentUser.rights === Rights.Admin && <Link to="/createExercise" className="mt-4 p-2 inline-block rounded bg-blue-600 text-white">
          {t('createExercise')}
        </Link>}
      </div>}

      <div className="my-4">
        <h1 className="font-bold text-2xl text-center">{t('mySolutions')}</h1>

        {mySolutions.length === 0
          ? <div className="my-2 p-2 rounded text-cyan-500 text-center">{t('noSolutionsFound')}</div>
          : (
            <div className="my-2 grid grid-cols-4 gap-2">
              {mySolutions.map(({exerciseId, correctionStatus}) =>
                correctionStatus === CorrectionStatus.Finished
                  ? <Link to={`exercises/${exerciseId}/reviewCorrection`} key={exerciseId}
                    className="p-2 rounded border bg-blue-500 text-white text-center w-full">
                    {exerciseId} - {correctionStatus}
                  </Link>
                  : <button type="button" key={exerciseId} className="p-2 rounded border bg-blue-500 text-white text-center w-full disabled:opacity-50"
                    disabled={true}>
                    {exerciseId} - {correctionStatus}
                  </button>)}
            </div>
          )}
      </div>
    </>
  );
}

interface IProps {
  currentUser: User;
}

export function Home({currentUser}: IProps): JSX.Element {

  const exercisesQuery = useHomeQuery();

  return (
    <div className="container mx-auto">
      <WithQuery query={exercisesQuery}>
        {({exercises, mySolutions}) => <Inner currentUser={currentUser} exercises={exercises} mySolutions={mySolutions}/>}
      </WithQuery>
    </div>
  );
}
