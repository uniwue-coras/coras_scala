export interface MinimalSolutionNodeMatch {
  sampleNodeId: number;
  userNodeId: number;
}

export function minimalSolutionNodeMatchesCorrespond(m1: MinimalSolutionNodeMatch, m2: MinimalSolutionNodeMatch): boolean {
  return m1.sampleNodeId === m2.sampleNodeId && m1.userNodeId === m2.userNodeId;
}
