import { ReactElement } from "react";
import { ParagraphCorrelationFragment, ParagraphCorrelationSolNodeFragment, ParagraphIdentifierFragment } from "../graphql";
import { RecursiveSolutionNodeDisplay } from "../RecursiveSolutionNodeDisplay";
import { ParagraphCorrelationNodeDisplay } from "./ParagraphCorrelationNodeDisplay";
import { stringifyParagraphIdentifier } from "../paragraph";

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: ParagraphCorrelationSolNodeFragment[];
  userSolutionNodes: ParagraphCorrelationSolNodeFragment[];
  paragraphCorrelations: ParagraphCorrelationFragment[];
}

export function ParagraphCorrelation({ /*exerciseId, username,*/ sampleSolutionNodes, userSolutionNodes, paragraphCorrelations }: IProps): ReactElement {

  const onClick = (parId: ParagraphIdentifierFragment) => console.info(stringifyParagraphIdentifier(parId));

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes}>
          {(node, depth) => <ParagraphCorrelationNodeDisplay node={node} depth={depth} paragraphCorrelations={paragraphCorrelations} onClick={onClick} />}
        </RecursiveSolutionNodeDisplay>
      </div>

      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={userSolutionNodes}>
          {(node, depth) => <ParagraphCorrelationNodeDisplay node={node} depth={depth} paragraphCorrelations={paragraphCorrelations} onClick={onClick} />}
        </RecursiveSolutionNodeDisplay>
      </div>
    </div>
  );
}
