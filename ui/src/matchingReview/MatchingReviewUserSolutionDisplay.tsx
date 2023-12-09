import { ReactElement } from 'react';
import { MatchRevUserSolFragment } from '../graphql';
import { MatchingReviewSolutionDisplay } from './MatchingReviewSolutionDisplay';

interface IProps {
  userSol: MatchRevUserSolFragment;
}

export function MatchingReviewUserSolutionDisplay({ userSol }: IProps): ReactElement {

  const { nodes, goldStandardMatches } = userSol;

  return (
    <>
      <MatchingReviewSolutionDisplay isSample={false} nodes={nodes} matches={goldStandardMatches} />
    </>
  );
}
