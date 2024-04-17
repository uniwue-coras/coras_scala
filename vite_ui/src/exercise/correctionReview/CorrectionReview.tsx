import { ReviewDataFragment } from '../../graphql';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewSampleSolNode } from './ReviewSampleSolNode';
import { ReviewUserSolNode } from './ReviewUserSolNode';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';

interface IProps {
  reviewData: ReviewDataFragment;
}

export function CorrectionReview({ reviewData }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleSolution, userSolution, matches, comment, points } = reviewData;

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-3 gap-2">

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={true} allNodes={sampleSolution} allMatches={matches}>
            {(props) => <ReviewSampleSolNode {...props} />}
          </RecursiveSolutionNodeDisplay>
        </section>

        <section className="col-span-2 px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('userSolution')}</h2>

          <RecursiveSolutionNodeDisplay isSample={false} allNodes={userSolution} allMatches={matches}>
            {(props) => <ReviewUserSolNode {...props} />}
          </RecursiveSolutionNodeDisplay>
        </section>
      </div>

      <div className="my-4 container mx-auto p-2 rounded border-2 border-amber-500">
        <p>{comment}</p>
        <p className="text-center">{points} {t('points')}</p>
      </div>

    </div>
  );
}
