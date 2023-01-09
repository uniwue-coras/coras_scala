import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, CurrentSelection, FlatSolutionNodeWithAnnotations, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {ErrorType} from './CorrectionColumn';
import {IColor} from '../colors';
import {FlatSolutionNodeFragment} from '../graphql';
import {AnnotationEditingProps, AnnotationView} from './AnnotationView';
import {IAnnotation} from './shortCutHelper';

const indentPerRow = 40;

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side?: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => void;
}

interface IProps {
  matches: ColoredMatch[];
  currentNode: FlatSolutionNodeWithAnnotations;
  currentSelection?: CurrentSelection;
  allNodes: FlatSolutionNodeWithAnnotations[];
  depth?: number;
  showSubTexts: boolean;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
  editAnnotation: AnnotationEditingProps;
}

export function getFlatSolutionNodeChildren<T extends FlatSolutionNodeFragment>(allNodes: T[], currentId: number | null): T[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

const getMarkedSubText = (currentNodeId: number, subText: string, currentSelection: CurrentSelection | undefined): JSX.Element | undefined => {
  if (currentSelection === undefined || currentSelection._type !== 'IAnnotation' || currentSelection.nodeId !== currentNodeId) {
    return undefined;
  }

  const {startOffset, endOffset} = currentSelection;

  const bgColor: string = {
    [ErrorType.Missing]: 'bg-amber-500',
    [ErrorType.Wrong]: 'bg-red-500'
  }[currentSelection.errorType];

  return (
    <div>
      <span>{subText.substring(0, startOffset)}</span>
      <span className={bgColor}>{subText.substring(startOffset, endOffset)}</span>
      <span>{subText.substring(endOffset)}</span>
    </div>
  );
};

export function UserSolutionNodeDisplay({
  matches,
  currentNode,
  currentSelection,
  allNodes,
  depth = 0,
  showSubTexts,
  selectedNodeId,
  onNodeClick,
  dragProps,
  editAnnotation
}: IProps): JSX.Element {

  const mainMatchColor: IColor | undefined = matches.find(({userValue}) => currentNode.id === userValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const markedSubText = currentNode.subText !== undefined && currentNode.subText !== null
    ? getMarkedSubText(currentNode.id, currentNode.subText, currentSelection)
    : undefined;

  const ownAnnotation = currentSelection !== undefined && currentSelection._type === 'IAnnotation' && currentSelection.nodeId === currentNode.id
    ? currentSelection
    : undefined;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <section style={{paddingLeft: `${indentPerRow * depth}px`}}>
          <div className="mb-2 p-2" onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}>
            <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
                          mainMatchColor={mainMatchColor}/>
          </div>

          {showSubTexts && currentNode.subText && <div id={`node_${SideSelector.User}_${currentNode.id}`} style={{
            marginLeft: `${indentPerRow}px`,
            whiteSpace: 'pre-wrap'
          }}>{markedSubText !== undefined ? markedSubText : currentNode.subText}</div>}
        </section>

        <section>
          {currentNode.annotations.map((annotation) => <p key={annotation.startOffset}>{annotation.comment}</p>)}

          {ownAnnotation && <AnnotationView annotation={ownAnnotation} {...editAnnotation}/>}
        </section>
      </div>

      <div>
        {getFlatSolutionNodeChildren(allNodes, currentNode.id).map((child) =>
          <UserSolutionNodeDisplay key={child.childIndex} matches={matches} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                   showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} dragProps={dragProps}
                                   currentSelection={currentSelection} editAnnotation={editAnnotation}/>
        )}
      </div>
    </div>
  );
}
