import { ReviewDataFragment } from '../../graphql';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewSampleSolNode } from './ReviewSampleSolNode';
import { ReviewUserSolNode } from './ReviewUserSolNode';
import { SolutionDisplay } from '../../solutionDisplay/SolutionDisplay';

interface IProps {
  reviewData: ReviewDataFragment;
}

export function CorrectionReview({ reviewData }: IProps): ReactElement {

  const { t } = useTranslation('common');

  const { sampleSolution, userSolution, matches, comment, points } = reviewData;

  return (
    <>
      <div className="p-2 grid grid-cols-2 gap-2">

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          <SolutionDisplay isSample={true} nodes={sampleSolution} matches={matches} >
            {(textProps) => <ReviewSampleSolNode {...textProps} parentMatched={true} />}
          </SolutionDisplay>

          {/*getRootNodes(sampleSolution).map((currentNode) =>
            <BasicNodeDisplay key={currentNode.id} depth={0} node={currentNode} nodes={sampleSolution} matches={matches} >
              {(textProps) => <ReviewSampleSolNode parentMatched={true} {...textProps} />}
  </BasicNodeDisplay>)*/}
        </section>

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('userSolution')}</h2>

          <SolutionDisplay isSample={false} nodes={userSolution} matches={matches}>
            {(textProps) => <ReviewUserSolNode {...textProps} />}
          </SolutionDisplay>

          {/*getRootNodes(userSolution).map((currentNode) =>
            <BasicNodeDisplay key={currentNode.id} depth={0} node={currentNode} nodes={userSolution} matches={matches}>
              {(textProps) => <ReviewUserSolNode {...textProps} />}
            </BasicNodeDisplay>) */}
        </section>
      </div>

      <div className="my-4 container mx-auto p-2 rounded border-2 border-amber-500">
        <p>{comment}</p>
        <p className="text-center">{points} {t('points')}</p>
      </div>

    </>
  );
}
