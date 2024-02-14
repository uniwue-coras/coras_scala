import { useTranslation } from 'react-i18next';
import { OperationVariables, QueryResult } from '@apollo/client';
import { ReactElement } from 'react';
import classNames from 'classnames';

interface IProps<T, V extends OperationVariables = OperationVariables> {
  query: QueryResult<T, V>;
  children: (t: T, refetch: () => void) => ReactElement;
}

export function WithQuery<T, V extends OperationVariables = OperationVariables>({ query: { data, loading, error, refetch }, children }: IProps<T, V>): ReactElement {

  const { t } = useTranslation('common');

  if (!data) {
    const classes = classNames('notification', 'has-text-centered', { 'is-info': loading, 'is-warning': !!error });

    return (
      <div className={classes}>
        {loading && <span>{t('loadingData')}...</span>}
        {error && error.message}
      </div>
    );
  } else {
    return children(data, refetch);
  }
}
