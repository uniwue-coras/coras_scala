import {QueryResult} from '@apollo/client/react/types/types';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

interface IProps<T, S> {
  query: QueryResult<T, S>;
  children: (t: T) => JSX.Element;
}

export function WithQuery<T, S>({query: {data, loading, error}, children}: IProps<T, S>): JSX.Element {

  const {t} = useTranslation('common');

  if (!data) {
    const classes = classNames('notification', 'has-text-centered', {'is-info': loading, 'is-warning': !!error});

    return (
      <div className={classes}>
        {loading && <span>{t('loadingData')}...</span>}
        {error && error.message}
      </div>
    );
  } else {
    return children(data);
  }
}
