import { CorrectionStatus, useInitiateCorrectionMutation } from '../graphql';
import { Link } from 'react-router-dom';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { executeMutation } from '../mutationHelpers';
import { isDefined } from '../funcs';

interface IProps {
  username: string;
  exerciseId: number;
  correctionStatus: CorrectionStatus;
}

export function UserSolutionOverviewBox({ username, exerciseId, correctionStatus: initialCorrectionStatus }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const [correctionStatus, setNewCorrStatus] = useState(initialCorrectionStatus);
  const [initiateCorrection] = useInitiateCorrectionMutation();

  const onInitiateCorrection = async () => {
    executeMutation(
      () => initiateCorrection({ variables: { username, exerciseId } }),
      ({ exerciseMutations }) => {
        const newCorrectionStatus = exerciseMutations?.userSolution?.initiateCorrection;

        if (isDefined(newCorrectionStatus)) {
          setNewCorrStatus(newCorrectionStatus);
        }
      });
  };

  const footerElement: ReactElement = {
    [CorrectionStatus.Waiting]: <button type="button" onClick={onInitiateCorrection}>{t('initiateCorrection')}</button>,
    [CorrectionStatus.Ongoing]: <Link className="text-blue-600" to={`/exercises/${exerciseId}/solutions/${username}/correctSolution`}>{t('correctSolution')}</Link>,
    [CorrectionStatus.Finished]: <div className="italic text-cyan-500">{t('correctionAlreadyFinished!')}</div>
  }[correctionStatus];

  return (
    <div >
      <header className="p-2 rounded-t border border-slate-600 text-center">{username}</header>
      <footer className="p-2 border-b border-x border-slate-600 text-center">{footerElement}</footer>
    </div>
  );
}
