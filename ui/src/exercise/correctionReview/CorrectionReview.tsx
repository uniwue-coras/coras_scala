import {ReviewDataFragment} from '../../graphql';
import {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {BasicNodeDisplay, getFlatSolutionNodeChildren} from '../BasicNodeDisplay';
import {ReviewSampleSolNode} from './ReviewSampleSolNode';
import {ReviewUserSolNode} from './ReviewUserSolNode';

interface IProps {
  reviewData: ReviewDataFragment;
}

export function CorrectionReview({reviewData}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {sampleSolution, userSolution, matches, comment, points} = reviewData;

  return (
    <>
      <div className="p-2 grid grid-cols-2 gap-2">

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

          {getFlatSolutionNodeChildren(sampleSolution, null).map((currentNode) =>
            <BasicNodeDisplay key={currentNode.id} otherProps={{allNodes: sampleSolution, currentNode, matches, depth: 0}}>
              {(textProps) => <ReviewSampleSolNode parentMatched={true} {...textProps}/>}
            </BasicNodeDisplay>)}
        </section>

        <section className="px-2 max-h-screen overflow-scroll">
          <h2 className="font-bold text-center">{t('userSolution')}</h2>

          {getFlatSolutionNodeChildren(userSolution, null).map((currentNode) =>
            <BasicNodeDisplay key={currentNode.id} otherProps={{allNodes: userSolution, currentNode, matches, depth: 0}}>
              {(textProps) => <ReviewUserSolNode {...textProps}/>}
            </BasicNodeDisplay>)}
        </section>
      </div>

      <div className="my-4 container mx-auto p-2 rounded border-2 border-amber-500">
        <p>{comment}</p>
        <p className="text-center">{points} {t('points')}</p>
      </div>

    </>
  );
}
