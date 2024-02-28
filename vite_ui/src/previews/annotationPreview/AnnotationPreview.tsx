import { ReactElement } from 'react';
import { CorrectionResultFragment, MatchingReviewSolNodeFragment } from '../../graphql';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { AnnotationPreviewSampleNodeDisplay } from './AnnotationPreviewNodeDisplay';
import { AnnotationPreviewUserNodeDisplay } from './AnnotationPreviewUserNodeDisplay';

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  userSolutionNodes: MatchingReviewSolNodeFragment[];
  correctionResult: CorrectionResultFragment;
}

export function AnnotationPreview({ sampleSolutionNodes, userSolutionNodes, correctionResult: { matches, annotations } }: IProps): ReactElement {

  const onDragDrop = async (sampleId: number, userId: number) => {
    console.info(sampleId + ' :: ' + userId);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="px-4 h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes}>
          {(node, depth) => <AnnotationPreviewSampleNodeDisplay isSample={true} node={node} depth={depth} ownMatches={matches.filter(({ sampleNodeId }) => sampleNodeId === node.id)}
            onDragDrop={onDragDrop} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div className="col-span-2">
        <div className="px-4 h-screen overflow-y-scroll">
          <RecursiveSolutionNodeDisplay nodes={userSolutionNodes}>
            {(node, depth) => <AnnotationPreviewUserNodeDisplay isSample={false} node={node} depth={depth} ownMatches={matches.filter(({ userNodeId }) => userNodeId === node.id)}
              ownAnnotations={annotations.filter(({ nodeId }) => nodeId === node.id)} onDragDrop={onDragDrop} />}
          </RecursiveSolutionNodeDisplay>
        </div>
      </div>
    </div>
  );
}
