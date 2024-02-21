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
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="px-4 h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes}>
          {(node, depth) => <AnnotationPreviewNodeDisplay node={node} depth={depth} ownMatch={matches.find(({ sampleNodeId }) => sampleNodeId === node.id)}
            ownAnnotations={[]} matchCurrentlyExamined={undefined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div className="col-span-2">
        <div className="px-4 h-screen overflow-y-scroll">
          <RecursiveSolutionNodeDisplay nodes={userSolutionNodes}>
            {(node, depth) => <AnnotationPreviewNodeDisplay node={node} depth={depth} ownMatch={matches.find(({ userNodeId }) => userNodeId === node.id)}
              ownAnnotations={annotations.filter(({ nodeId }) => nodeId === node.id)} matchCurrentlyExamined={undefined} />}
          </RecursiveSolutionNodeDisplay>
        </div>
      </div>
    </div>
  );
}
