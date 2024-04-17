import { ReactElement, useState } from 'react';
import { CorrectionResultFragment, MatchingReviewSolNodeFragment, useAddSubTreeMatchLazyQuery } from '../../graphql';
import { RecursiveSolutionNodeDisplay } from '../../RecursiveSolutionNodeDisplay';
import { AnnotationPreviewUserNodeDisplay } from './AnnotationPreviewUserNodeDisplay';
import { AnnotationPreviewSampleNodeDisplay } from './AnnotationPreviewSampleNodeDisplay';
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
    <div className="grid grid-cols-3 gap-4">
      <div className="px-2 h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay isSample={true} allNodes={sampleSolutionNodes} allMatches={matches}>
          {(props) => <AnnotationPreviewSampleNodeDisplay isSample={true} {...props} onDragDrop={onDragDrop} />}
        </RecursiveSolutionNodeDisplay>
      </div>

      <div className="col-span-2">
        <div className="px-2 h-screen overflow-y-scroll">
          <RecursiveSolutionNodeDisplay isSample={false} allNodes={userSolutionNodes} allMatches={matches}>
            {(props) => <AnnotationPreviewUserNodeDisplay isSample={false} {...props} onDragDrop={onDragDrop}
              ownAnnotations={annotations.filter(({ nodeId }) => nodeId === props.node.id)}
              rejectAnnotation={(annoId) => rejectAnnotation(props.node.id, annoId)} />}
          </RecursiveSolutionNodeDisplay>
        </div>
      </div>
    </div>
  );
}
