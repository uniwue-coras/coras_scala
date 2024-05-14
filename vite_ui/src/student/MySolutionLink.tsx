import { ReactElement } from 'react';
import { SolutionIdentifierFragment } from '../graphql';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reviewCorrectionUrlFragment, submitOwnSolutionUrlFragment } from '../urls';
import { isDefined } from '../funcs';

const buttonClasses = 'p-2 rounded border bg-blue-500 text-white text-center w-full';
const divClasses = 'p-2 rounded border border-slate-500 text-center w-full';

export function MySolutionLink({ exerciseId, exerciseTitle, correctionFinished }: SolutionIdentifierFragment): ReactElement {

  const { t } = useTranslation('common');

  const baseTitle = `${exerciseId}. ${exerciseTitle}`;

  if (!isDefined(correctionFinished)) {
    return (
      <Link to={`exercises/${exerciseId}/${submitOwnSolutionUrlFragment}`} className={buttonClasses}>
        {baseTitle}: <span className="font-bold">{t('submitSolution!')}</span>
      </Link>
    );
  }

  return correctionFinished
    ? <Link to={`exercises/${exerciseId}/${reviewCorrectionUrlFragment}`} className={buttonClasses}>{baseTitle}: {t('correctionFinished')}</Link>
    : <div className={divClasses}>{baseTitle}: {t('correctionPending')}</div>;
}
