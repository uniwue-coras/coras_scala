import {JSX} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../../urls';
import {WithQuery} from '../../WithQuery';
import {CorrectionReviewQuery, useCorrectionReviewQuery} from '../../graphql';
import {useTranslation} from 'react-i18next';
import {BasicNodeDisplay, getFlatSolutionNodeChildren} from '../BasicNodeDisplay';
import {ReviewSampleSolNode} from './ReviewSampleSolNode';
import {ReviewUserSolNode} from './ReviewUserSolNode';

function Inner({reviewCorrection}: CorrectionReviewQuery): JSX.Element {

  const {t} = useTranslation('common');

  const {sampleSolution, userSolution, matches, comment, points} = reviewCorrection;

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

export function CorrectionReview(): JSX.Element {

  const {exId} = useParams<'exId'>();

  if (exId === undefined) {
    return <Navigate to={homeUrl}/>;
  }

  const exerciseId = parseInt(exId);

  const query = useCorrectionReviewQuery({variables: {exerciseId}});

  return (
    <WithQuery query={query}>
      {({reviewCorrection}) => <Inner reviewCorrection={reviewCorrection}/>}
    </WithQuery>
  );
}
