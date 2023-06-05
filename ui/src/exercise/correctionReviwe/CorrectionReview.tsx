import {JSX} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../../urls';
import {WithQuery} from '../../WithQuery';
import {CorrectionReviewQuery, useCorrectionReviewQuery} from '../../graphql';
import {useTranslation} from 'react-i18next';
import {BasicNodeDisplay, getFlatSolutionNodeChildren} from '../BasicNodeDisplay';
import {ReviewSampleSolutionNodeDisplay} from './ReviewSampleSolutionNodeDisplay';

function Inner({reviewCorrection}: CorrectionReviewQuery): JSX.Element {

  const {t} = useTranslation('common');

  const {sampleSolution, userSolution, matches} = reviewCorrection;

  const sampleRootNodes = getFlatSolutionNodeChildren(sampleSolution, null);
  const userRootNodes = getFlatSolutionNodeChildren(userSolution, null);

  return (
    <div className="p-2 grid grid-cols-2 gap-2">

      <section>
        <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

        {sampleRootNodes.map((currentNode) =>
          <BasicNodeDisplay key={currentNode.id} otherProps={{allNodes: sampleSolution, currentNode, matches, depth: 0}}>
            {(textProps) => <ReviewSampleSolutionNodeDisplay {...textProps}/>}
          </BasicNodeDisplay>)}
      </section>

      <section>
        <h2 className="font-bold text-center">{t('userSolution')}</h2>

        {userRootNodes.map((currentNode) =>
          <BasicNodeDisplay key={currentNode.id} otherProps={{allNodes: userSolution, currentNode, matches, depth: 0}}>
            {({currentNode}) => <div>{currentNode.text}</div>}
          </BasicNodeDisplay>)}
      </section>

    </div>
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
      {(data) => data
        ? <Inner {...data}/>
        : <Navigate to={homeUrl}/>}
    </WithQuery>
  );
}
