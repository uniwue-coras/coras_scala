import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

type Error = {
  message: string;
}

interface MyQueryResult<T, S extends Error> {
  data?: T;
  loading: boolean;
  error?: S | null;
}

interface IProps<T, S extends Error> {
  query: MyQueryResult<T, S>;
  children: (t: T) => JSX.Element;
}

export function WithQuery<T, S extends Error>({query: {data, loading, error}, children}: IProps<T, S>): JSX.Element {

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
