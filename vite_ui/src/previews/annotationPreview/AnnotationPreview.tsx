import { ReactElement } from 'react';
import { CorrectionResultFragment, MatchingReviewSolNodeFragment, useAddSubTreeMatchLazyQuery } from '../../graphql';
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

export function AnnotationPreview({ exerciseId, username, sampleSolutionNodes, userSolutionNodes, correctionResult: { matches, annotations } }: IProps): ReactElement {

  const [addSubTreeMatch] = useAddSubTreeMatchLazyQuery();

  const onDragDrop = async (sampleNodeId: number, userNodeId: number) => {
    // console.info(sampleId + " :: " + userId);
    const { data } = await addSubTreeMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } });

    if (data?.exercise?.userSolution?.node) {
      console.info(JSON.stringify(data.exercise.userSolution.node.addAnnotationPreviewMatch, null, 2));
    }
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
