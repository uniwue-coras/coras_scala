import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, CurrentSelection, FlatSolutionNodeWithAnnotations, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {ErrorType} from './CorrectionColumn';
import {IColor} from '../colors';
import {FlatSolutionNodeFragment} from '../graphql';
import {AnnotationEditingProps, AnnotationEditor} from './AnnotationEditor';
import {useState} from 'react';
import {IAnnotation} from './shortCutHelper';
import {AnnotationView} from './AnnotationView';

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
  removeAnnotation: (nodeId: number, annotationIndex: number) => void;
}

export function getFlatSolutionNodeChildren<T extends FlatSolutionNodeFragment>(allNodes: T[], currentId: number | null): T[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

function getMarkedSubText(
  subText: string,
  currentEditedAnnotation: IAnnotation | undefined,
  focusedAnnotation: IAnnotation | undefined
): JSX.Element | undefined {
  const annotationToMark = currentEditedAnnotation !== undefined
    ? currentEditedAnnotation
    : focusedAnnotation;

  if (annotationToMark === undefined) {
    return undefined;
  }

  const {startOffset, endOffset} = annotationToMark;

  const bgColor: string = {
    [ErrorType.Missing]: 'bg-amber-500',
    [ErrorType.Wrong]: 'bg-red-500'
  }[annotationToMark.errorType];

  return (
    <div>
      <span>{subText.substring(0, startOffset)}</span>
      <span className={bgColor}>{subText.substring(startOffset, endOffset)}</span>
      <span>{subText.substring(endOffset)}</span>
    </div>
  );
}

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
  editAnnotation,
  removeAnnotation
}: IProps): JSX.Element {

  const [focusedAnnotationIndex, setFocusedAnnotationIndex] = useState<number>();

  const mainMatchColor: IColor | undefined = matches.find(({userValue}) => currentNode.id === userValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const editedAnnotation = currentSelection !== undefined && currentSelection._type === 'IAnnotation' && currentSelection.nodeId === currentNode.id
    ? currentSelection
    : undefined;

  const focusedAnnotation = focusedAnnotationIndex !== undefined
    ? currentNode.annotations[focusedAnnotationIndex]
    : undefined;

  return (
    <>
      <section style={{paddingLeft: `${indentPerRow * depth}px`}} className="grid grid-cols-2 gap-2">
        <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
                      mainMatchColor={mainMatchColor} onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}/>

        <section>
          {currentNode.annotations.map((annotation, index) =>
            <AnnotationView key={index} annotation={annotation} isHighlighted={index === focusedAnnotationIndex}
                            onMouseEnter={() => setFocusedAnnotationIndex(index)} onMouseLeave={() => setFocusedAnnotationIndex(undefined)}
                            removeAnnotation={() => removeAnnotation(currentNode.id, index)}/>
          )}

          {editedAnnotation && <AnnotationEditor annotation={editedAnnotation} {...editAnnotation}/>}
        </section>
      </section>

      <div>
        {getFlatSolutionNodeChildren(allNodes, currentNode.id).map((child) =>
          <UserSolutionNodeDisplay key={child.childIndex} matches={matches} currentNode={child} allNodes={allNodes} depth={depth + 1}
                                   showSubTexts={showSubTexts} selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} dragProps={dragProps}
                                   currentSelection={currentSelection} editAnnotation={editAnnotation} removeAnnotation={removeAnnotation}/>
        )}
      </div>
    </>
  );
}
