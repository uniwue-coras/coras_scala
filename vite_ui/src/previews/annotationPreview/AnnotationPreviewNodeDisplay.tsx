import { NodeDisplayProps } from '../../exercise/nodeDisplayProps';
import { MatchingReviewSolNodeFragment } from '../../graphql';
import { MinimalSolutionNodeMatch } from '../../minimalSolutionNodeMatch';

export interface AnnotationPreviewNodeDisplayProps<M extends MinimalSolutionNodeMatch = MinimalSolutionNodeMatch>
  extends NodeDisplayProps<MatchingReviewSolNodeFragment, M> {
  isSample: boolean;
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

