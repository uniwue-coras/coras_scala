import {ReactElement} from 'react';
import {CorrectionStatus, SolutionIdentifierFragment} from '../graphql';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {reviewCorrectionUrlFragment, submitOwnSolutionUrlFragment} from '../urls';

const buttonClasses = 'p-2 rounded border bg-blue-500 text-white text-center w-full';
const divClasses = 'p-2 rounded border border-slate-500 text-center w-full';

export function MySolutionLink({exerciseId, exerciseTitle, correctionStatus}: SolutionIdentifierFragment): ReactElement {

  const {t} = useTranslation('common');

  const baseTitle = `${exerciseId}. ${exerciseTitle}`;

  if (correctionStatus === undefined || correctionStatus === null) {
    return (
      <Link to={`exercises/${exerciseId}/${submitOwnSolutionUrlFragment}`} className={buttonClasses}>
        {baseTitle}: <span className="font-bold">{t('submitSolution!')}</span>
      </Link>
    );
  }

  return {
    [CorrectionStatus.Waiting]: <div className={divClasses}>{baseTitle}: {t('waitingForCorrectionStart')}</div>,
    [CorrectionStatus.Ongoing]: <div className={divClasses}>{baseTitle}: {t('correctionPending')}</div>,
    [CorrectionStatus.Finished]: (
      <Link to={`exercises/${exerciseId}/${reviewCorrectionUrlFragment}`} className={buttonClasses}>{baseTitle}: {t('correctionFinished')}</Link>
    )
  }[correctionStatus];
}
