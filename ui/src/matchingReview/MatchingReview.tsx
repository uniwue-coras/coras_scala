import { ReactElement, useState } from 'react';
import { MatchingReviewSolutionDisplay } from './MatchingReviewSolutionDisplay';
import { CurrentMatchFragment, MatchRevSampleSolNodeFragment, MatchRevUserSolNodeFragment } from '../graphql';
import { SolNodeMatchExplanation } from './MatchExplanation';
import { useTranslation } from 'react-i18next';

interface IProps {
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  userSolutionNodes: MatchRevUserSolNodeFragment[];
  matches: CurrentMatchFragment[];
}

function matchFragmentsEqual(m1: CurrentMatchFragment, m2: CurrentMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
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
        return matchFragmentsEqual(currentExaminedMatch, newExaminedMatch) ? undefined : newExaminedMatch;
      }
    });
  };

  // TODO: implement?
  const onMouseEnter = (/*isWord: boolean, explanationIndex: number*/) => void 0;
  const onMouseLeave = () => void 0;

  return (
    <>
      <div className="h-screen overflow-y-scroll">
        <MatchingReviewSolutionDisplay isSample={true} nodes={sampleSolutionNodes}   {...{ matches, onNodeClick, matchCurrentlyExamined }} />
      </div>
      <div className="h-screen overflow-y-scroll">
        <MatchingReviewSolutionDisplay isSample={false} nodes={userSolutionNodes}  {...{ matches, onNodeClick, matchCurrentlyExamined }} />
      </div>
      <div>
        {currentExaminedMatch &&
          (currentExaminedMatch.maybeExplanation
            ? <SolNodeMatchExplanation explanation={currentExaminedMatch.maybeExplanation} {...{ onMouseEnter, onMouseLeave }} />
            : <div className="text-center">{t('stringEquality')}</div>)}
      </div>
    </>
  );
}
