import { ReactElement, useState } from 'react';
import { CurrentMatchFragment, FlatSampleSolutionNodeFragment, FlatUserSolutionNodeFragment } from '../graphql';
import { SolNodeMatchExplanation } from './MatchExplanation';
import { useTranslation } from 'react-i18next';
import { SolutionDisplay } from '../solutionDisplay/SolutionDisplay';
import { MatchingReviewNodeDisplay, matchesEqual } from './MatchingReviewNodeDisplay';
import { SampleSubTextNodesDisplay } from '../exercise/SampleSubTextNodesDisplay';
import { UserSubTextNodesDisplay } from '../exercise/UserSubTextNodeDisplay';

interface IProps {
  sampleSolutionNodes: FlatSampleSolutionNodeFragment[];
  userSolutionNodes: FlatUserSolutionNodeFragment[];
  matches: CurrentMatchFragment[];
}

export function MatchingReview({ sampleSolutionNodes, userSolutionNodes, matches }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentExaminedMatch, setCurrentExaminedMatch] = useState<CurrentMatchFragment>();

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
        return matchesEqual(currentExaminedMatch, newExaminedMatch) ? undefined : newExaminedMatch;
      }
    });
  };

  // TODO: implement?
  const onMouseEnter = (/*isWord: boolean, explanationIndex: number*/) => void 0;
  const onMouseLeave = () => void 0;

  return (
    <>
      <div className="h-screen overflow-y-scroll">
        <SolutionDisplay isSample={true} nodes={sampleSolutionNodes} matches={matches} displaySubTexts={(node) => <SampleSubTextNodesDisplay node={node} />}>
          {({ node, depth, ownMatch }) => <MatchingReviewNodeDisplay isSample={true} {...{ node, ownMatch, depth, matchCurrentlyExamined, onNodeClick }} />}
        </SolutionDisplay>
      </div>
      <div className="h-screen overflow-y-scroll">
        <SolutionDisplay isSample={false} nodes={userSolutionNodes} matches={matches} displaySubTexts={(node) => <UserSubTextNodesDisplay node={node} />}>
          {({ node, depth, ownMatch }) => <MatchingReviewNodeDisplay isSample={false} {...{ node, ownMatch, depth, matchCurrentlyExamined, onNodeClick }} />}
        </SolutionDisplay>
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
