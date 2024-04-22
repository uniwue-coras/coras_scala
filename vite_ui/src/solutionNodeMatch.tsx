import { allMatchColors, subTextMatchColor } from './allMatchColors';
import { ISolutionNodeMatchFragment } from './graphql';

export function minimalSolutionNodeMatchesCorrespond(m1: ISolutionNodeMatchFragment, m2: ISolutionNodeMatchFragment): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}

export function getBackground(isSubtext: boolean, ownMatches: ISolutionNodeMatchFragment[]): { backgroundColor: string | undefined, backgroundImage: string | undefined } {
  if (ownMatches.length === 0) {
    return { backgroundColor: undefined, backgroundImage: undefined };
  } else if (ownMatches.length === 1) {
    return {
      backgroundColor: isSubtext
        ? subTextMatchColor
        : allMatchColors[ownMatches[0].sampleNodeId], backgroundImage: undefined
    };
  } else {

    const percentage = 1 / ownMatches.length * 100;

    const colors = ownMatches
      .map(({ sampleNodeId }) => allMatchColors[sampleNodeId])
      .map((color, index) => `${color} ${(index) * percentage}%, ${color} ${(index + 1) * percentage}%`);

    return { backgroundColor: undefined, backgroundImage: `linear-gradient(to right, ${colors.join(', ')})` };
  }
}
