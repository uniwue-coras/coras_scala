import {AllExercisesQuery, LoginResultFragment, Rights, useAllExercisesQuery} from './graphql';
import {WithQuery} from './WithQuery';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {createExerciseUrl, exercisesBaseUrl} from './urls';

interface IProps {
  currentUser: LoginResultFragment;
}

export function Home({currentUser}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const exercisesQuery = useAllExercisesQuery();

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('exercise_plural')}</h1>

      <WithQuery query={exercisesQuery}>
        {({exercises}: AllExercisesQuery) => exercises.length === 0
          ? <div className="notification is-primary has-text-centered">{t('noExercisesFound')}</div>
          : <div className="columns is-multiline">
            {exercises.map(({id, title}) => <div className="column is-one-third-desktop" key={id}>
              <Link to={`${exercisesBaseUrl}/${id}`} className="button is-fullwidth">{id}: {title}</Link>
            </div>)}
          </div>}
      </WithQuery>

      {currentUser.rights === Rights.Admin && <Link to={createExerciseUrl} className="my-3 button is-link is-fullwidth">{t('createExercise')}</Link>}
    </div>
  );
}
