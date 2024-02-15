import { ReactElement, useState } from 'react';
import { MatchingReviewSolutionDisplay } from './MatchingReviewSolutionDisplay';
import { DefaultSolutionNodeMatchFragment, MatchRevSampleSolNodeFragment, MatchRevUserSolNodeFragment, usePreviewMatchLazyQuery } from '../graphql';
import { SolNodeMatchExplanation } from './MatchExplanation';
import { useTranslation } from 'react-i18next';

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  userSolutionNodes: MatchRevUserSolNodeFragment[];
  matches: DefaultSolutionNodeMatchFragment[];
}

function matchFragmentsEqual(m1: DefaultSolutionNodeMatchFragment, m2: DefaultSolutionNodeMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}

export function MatchingReview({ exerciseId, username, sampleSolutionNodes, userSolutionNodes, matches }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentExaminedMatch, setCurrentExaminedMatch] = useState<DefaultSolutionNodeMatchFragment>();
  const [previewMatch] = usePreviewMatchLazyQuery();

  const matchCurrentlyExamined = currentExaminedMatch;

  const onNodeClick = (isSample: boolean, nodeId: number): void => {
    const newExaminedMatch = matches
      .find(({ sampleNodeId, userNodeId }) => (isSample ? sampleNodeId : userNodeId) === nodeId);

    setCurrentExaminedMatch((currentExaminedMatch) => {
      if (newExaminedMatch === undefined) {
        return undefined;
      } else if (currentExaminedMatch === undefined) {
        return newExaminedMatch;
      } else {
        return matchFragmentsEqual(currentExaminedMatch, newExaminedMatch) ? undefined : newExaminedMatch;
      }
    });
  };

  // TODO: implement?
  const onMouseEnter = (/*isWord: boolean, explanationIndex: number*/) => void 0;
  const onMouseLeave = () => void 0;

  const onDragDrop = async (sampleNodeId: number, userNodeId: number) => {
    const { data } = await previewMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } });

    const matchPreview = data?.exercise?.userSolution?.node?.previewMatchAgainst;

    console.info(JSON.stringify(matchPreview, null, 2))
  };

  return (
    <>
      <div className="h-screen overflow-y-scroll">
        <MatchingReviewSolutionDisplay isSample={true} nodes={sampleSolutionNodes}   {...{ matches, onNodeClick, matchCurrentlyExamined, onDragDrop }} />
      </div>
      <div className="h-screen overflow-y-scroll">
        <MatchingReviewSolutionDisplay isSample={false} nodes={userSolutionNodes}  {...{ matches, onNodeClick, matchCurrentlyExamined, onDragDrop }} />
      </div>
      <div>
        {currentExaminedMatch &&
          (currentExaminedMatch.maybeExplanation
            ? <SolNodeMatchExplanation explanation={currentExaminedMatch.maybeExplanation} {...{ onMouseEnter, onMouseLeave }} />
            : <div className="text-center">{t('completeEquality')}</div>)}
      </div>
    </>
  );
}
