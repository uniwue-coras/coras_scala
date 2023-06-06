import {CorrectionStatus} from '../graphql';
import {Link} from 'react-router-dom';
import {JSX} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  username: string;
  exerciseId: number;
  correctionStatus: CorrectionStatus;
  onInitiateCorrection: () => void;
}

export function UserSolutionOverviewBox({username, exerciseId, correctionStatus, onInitiateCorrection}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const footerElement: JSX.Element = {
    [CorrectionStatus.Waiting]:
      <button type="button" onClick={onInitiateCorrection}>{t('initiateCorrection')}</button>,
    [CorrectionStatus.Ongoing]:
      <Link className="text-blue-600" to={`/exercises/${exerciseId}/solutions/${username}/correctSolution`}>{t('correctSolution')}</Link>,
    [CorrectionStatus.Finished]: <div className="italic text-cyan-500">{t('correctionAlreadyFinished!')}</div>
  }[correctionStatus];

  return (
    <div key={username}>
      <header className="p-2 rounded-t border border-slate-600 text-center">{username}</header>

      <footer className="p-2 border-b border-x border-slate-600 text-center">{footerElement}</footer>

    </div>
  );

}
