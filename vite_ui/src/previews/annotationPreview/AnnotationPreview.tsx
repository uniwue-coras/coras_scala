import { ReactElement, useState } from 'react';
import { CorrectionResultFragment, MatchingReviewSolNodeFragment, useAddSubTreeMatchLazyQuery } from '../../graphql';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { AnnotationPreviewSampleNodeDisplay } from './AnnotationPreviewNodeDisplay';
import { AnnotationPreviewUserNodeDisplay } from './AnnotationPreviewUserNodeDisplay';
import update from 'immutability-helper';

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  userSolutionNodes: MatchingReviewSolNodeFragment[];
  correctionResult: CorrectionResultFragment;
}

export function AnnotationPreview({ exerciseId, username, sampleSolutionNodes, userSolutionNodes, correctionResult }: IProps): ReactElement {

  const [{ matches, annotations }, setCurrentCorrectionResult] = useState(correctionResult);
  const [addSubTreeMatch] = useAddSubTreeMatchLazyQuery();

  const onDragDrop = async (sampleNodeId: number, userNodeId: number) => {
    const { data } = await addSubTreeMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } });

    if (data?.exercise?.userSolution?.node) {
      const { newMatches, newAnnotations } = data.exercise.userSolution.node.addAnnotationPreviewMatch;
      setCurrentCorrectionResult((cm) => update(cm, { matches: { $push: newMatches }, annotations: { $push: newAnnotations } }));
    }
  };

  const rejectAnnotation = (nodeId: number, id: number) => setCurrentCorrectionResult((cr) => update(cr, {
    annotations: (annos) => annos.filter((anno) => anno.nodeId !== nodeId || anno.id !== id)
  }));

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
              ownAnnotations={annotations.filter(({ nodeId }) => nodeId === node.id)} onDragDrop={onDragDrop} rejectAnnotation={(annoId) => rejectAnnotation(node.id, annoId)} />}
          </RecursiveSolutionNodeDisplay>
        </div>
      </div>
    </div>
  );
}
