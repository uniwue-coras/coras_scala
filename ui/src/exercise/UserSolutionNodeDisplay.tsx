import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, CurrentSelection, FlatSolutionNodeWithAnnotations, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {ErrorType} from './CorrectionColumn';
import {IColor} from '../colors';
import {FlatSolutionNodeFragment} from '../graphql';
import {AnnotationEditingProps, AnnotationView} from './AnnotationView';
import {useState} from 'react';
import classNames from 'classnames';
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
  editAnnotation
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

  const markedSubText = currentNode.subText !== undefined && currentNode.subText !== null
    ? getMarkedSubText(currentNode.subText, editedAnnotation, focusedAnnotation)
    : undefined;

  return (
    <div>
      <div>
        <section style={{paddingLeft: `${indentPerRow * depth}px`}}>
          <div className="mb-2 p-2" onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}>
            <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
                          mainMatchColor={mainMatchColor}/>
          </div>

          {currentNode.subText && <div className="grid grid-cols-2 gap-2">
            <div id={`node_${SideSelector.User}_${currentNode.id}`} style={{
              marginLeft: `${indentPerRow}px`,
              whiteSpace: 'pre-wrap'
            }}>{markedSubText !== undefined ? markedSubText : currentNode.subText}</div>


            <section>
              {currentNode.annotations.map((annotation, index) =>
                <p key={annotation.startOffset} className={classNames('p-2 rounded border border-red-500', {'font-bold': index === focusedAnnotationIndex})}
                   onMouseEnter={() => setFocusedAnnotationIndex(index)} onMouseLeave={() => setFocusedAnnotationIndex(undefined)}>
                  {annotation.comment}
                </p>)}

              {editedAnnotation && <AnnotationView annotation={editedAnnotation} {...editAnnotation}/>}
            </section>
          </div>
          }
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
