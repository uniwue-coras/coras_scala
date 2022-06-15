import {AllExercisesQuery, Rights, useAllExercisesQuery} from './graphql';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {createExerciseUrl, exercisesBaseUrl} from './urls';
import {ILoginResult} from './myTsModels';

interface IProps {
  currentUser: ILoginResult;
}

export function Home({currentUser}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const exercisesQuery = useAllExercisesQuery();

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('exercise_plural')}</h1>

      <WithQuery query={exercisesQuery}>
        {({exercises}: AllExercisesQuery) => exercises.length === 0
          ? <div className="notification is-primary has-text-centered">{t('noExercisesFound')}</div>
          : <div className="mt-4 grid grid-cols-4 gap-2">
            {exercises.map(({id, title}) => <Link key={id} to={`${exercisesBaseUrl}/${id}`}
                                                  className="p-2 rounded border border-slate-600 text-center w-full">{id}: {title}</Link>)}
          </div>
        }
      </WithQuery>

      {currentUser.rights === Rights.Admin && <div className="mt-4">
        <Link to={createExerciseUrl} className="p-2 rounded bg-blue-600 text-white">{t('createExercise')}</Link>
      </div>}
    </div>
  );
}
