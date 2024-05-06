import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

export function ErrorBoundary(): ReactElement {

  const { t } = useTranslation('common');
  const error = useRouteError();

  console.error(error);

  return <div>{t('routingProblem')}</div>;
}
