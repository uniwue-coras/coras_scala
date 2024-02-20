import { ReactElement } from "react";
import { DefaultSolutionNodeMatchFragment, MatchingReviewSolNodeFragment } from "../../graphql";
import { RecursiveSolutionNodeDisplay } from "../../RecursiveSolutionNodeDisplay";
import { MatchingReviewNodeDisplay } from "../matchingReview/MatchingReviewNodeDisplay";

interface IProps {
  exerciseId: number;
  username: string;
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  userSolutionNodes: MatchingReviewSolNodeFragment[];
  matches: DefaultSolutionNodeMatchFragment[];
  // TODO: annotations?
}

export function AnnotationPreview({ exerciseId, username, sampleSolutionNodes, userSolutionNodes, matches }: IProps): ReactElement {

  // const { t } = useTranslation('common');

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
      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={sampleSolutionNodes}>
          {(node, depth) => <MatchingReviewNodeDisplay isSample={true} node={node} depth={depth} ownMatch={matches.find(({ sampleNodeId }) => sampleNodeId === node.id)}
            onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={undefined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div className="h-screen overflow-y-scroll">
        <RecursiveSolutionNodeDisplay nodes={userSolutionNodes}>
          {(node, depth) => <MatchingReviewNodeDisplay isSample={false} node={node} depth={depth} ownMatch={matches.find(({ userNodeId }) => userNodeId === node.id)}
            onNodeClick={onNodeClick} onDragDrop={onDragDrop} matchCurrentlyExamined={undefined} />}
        </RecursiveSolutionNodeDisplay>
      </div>
      <div>
        {/*currentExaminedMatch &&
          (currentExaminedMatch.maybeExplanation
            ? <SolNodeMatchExplanation explanation={currentExaminedMatch.maybeExplanation} {...{ onMouseEnter, onMouseLeave }} />
          : <div className="text-center">{t('completeEquality')}</div>)*/}
      </div>
    </div>
  );
}
