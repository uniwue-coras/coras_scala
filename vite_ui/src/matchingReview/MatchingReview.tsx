import { ReactElement, useState } from 'react';
import { RecursiveSolutionNodeDisplay } from '../RecursiveSolutionNodeDisplay';
import { DefaultSolutionNodeMatchFragment, MatchingReviewSolNodeFragment, usePreviewMatchLazyQuery } from '../graphql';
import { SolNodeMatchExplanation } from './MatchExplanation';
import { useTranslation } from 'react-i18next';
import { MatchingReviewNodeDisplay } from './MatchingReviewNodeDisplay';

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  userSolutionNodes: MatchingReviewSolNodeFragment[];
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

    const matchPreview: DefaultSolutionNodeMatchFragment | undefined = data?.exercise?.userSolution?.node?.previewMatchAgainst;

    console.info(JSON.stringify(matchPreview, null, 2))
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes} >
          {(node, depth) => <MatchingReviewNodeDisplay isSample={true} node={node} depth={depth} ownMatch={matches.find(({ sampleNodeId }) => sampleNodeId === node.id)}
            onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={matchCurrentlyExamined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={userSolutionNodes} >
          {(node, depth) => <MatchingReviewNodeDisplay isSample={false} node={node} depth={depth} ownMatch={matches.find(({ userNodeId }) => userNodeId === node.id)}
            onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={matchCurrentlyExamined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div>
        {currentExaminedMatch &&
          (currentExaminedMatch.maybeExplanation
            ? <SolNodeMatchExplanation explanation={currentExaminedMatch.maybeExplanation} {...{ onMouseEnter, onMouseLeave }} />
            : <div className="text-center">{t('completeEquality')}</div>)}
      </div>
    </div>
  );
}
