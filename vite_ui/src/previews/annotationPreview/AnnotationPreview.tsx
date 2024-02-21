import { ReactElement } from "react";
import { CorrectionResultFragment, MatchingReviewSolNodeFragment } from "../../graphql";
import { RecursiveSolutionNodeDisplay } from "../../RecursiveSolutionNodeDisplay";
import { AnnotationPreviewNodeDisplay } from "./AnnotationPreviewNodeDisplay";

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  userSolutionNodes: MatchingReviewSolNodeFragment[];
  correctionResult: CorrectionResultFragment;
}

export function AnnotationPreview({ sampleSolutionNodes, userSolutionNodes, correctionResult: { matches, annotations } }: IProps): ReactElement {

  const onNodeClick = (/*isSample: boolean, nodeId: number()*/): void => void 0;

  const onDragDrop = async (/*sampleNodeId: number, userNodeId: number*/) => {
    /*
    const { data } = await previewMatch({ variables: { exerciseId, username, sampleNodeId, userNodeId } });

    const matchPreview: DefaultSolutionNodeMatchFragment | undefined = data?.exercise?.userSolution?.node?.previewMatchAgainst;

    console.info(JSON.stringify(matchPreview, null, 2))
    */
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="px-4 h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes}>
          {(node, depth) => <AnnotationPreviewNodeDisplay isSample={true} node={node} depth={depth} ownMatch={matches.find(({ sampleNodeId }) => sampleNodeId === node.id)}
            ownAnnotations={[]} onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={undefined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-2">
        <div className="px-4 h-screen overflow-y-scroll">
          <RecursiveSolutionNodeDisplay nodes={userSolutionNodes}>
            {(node, depth) => <AnnotationPreviewNodeDisplay isSample={false} node={node} depth={depth} ownMatch={matches.find(({ userNodeId }) => userNodeId === node.id)}
              ownAnnotations={annotations.filter(({ nodeId }) => nodeId === node.id)} onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={undefined} />}
          </RecursiveSolutionNodeDisplay>
        </div>
        <div />
      </div>
    </div>
  );
}
