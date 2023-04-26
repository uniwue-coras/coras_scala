import {FlatNodeText} from './FlatNodeText';
import {ColoredMatch, SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {IColor} from '../colors';
import {AnnotationEditingProps, AnnotationEditor} from './AnnotationEditor';
import {useState} from 'react';
import {AnnotationView} from './AnnotationView';
import {AnnotationFragment, FlatUserSolutionNodeFragment, IFlatSolutionNodeFragment} from '../graphql';
import {CurrentSelection} from './currentSelection';

const indentPerRow = 40;

export interface MarkedNodeIdProps {
  nodeId: number | undefined;
  matchingNodeIds: number[] | undefined;
}

export interface DragStatusProps {
  draggedSide?: SideSelector;
  setDraggedSide: (side: SideSelector | undefined) => void;
  onDrop: (sampleNodeId: number, userNodeId: number) => Promise<void>;
}

interface IProps {
  matches: ColoredMatch[];
  currentNode: FlatUserSolutionNodeFragment;
  currentSelection?: CurrentSelection;
  allNodes: FlatUserSolutionNodeFragment[];
  depth?: number;
  selectedNodeId: MarkedNodeIdProps;
  onNodeClick: (id?: number | undefined) => void;
  dragProps: DragStatusProps;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

export function getFlatSolutionNodeChildren<T extends IFlatSolutionNodeFragment>(allNodes: T[], currentId: number | null): T[] {
  return allNodes.filter(({parentId}) =>
    currentId === null
      ? parentId === undefined || parentId === null
      : parentId === currentId);
}

export function UserSolutionNodeDisplay({
  matches,
  currentNode,
  currentSelection,
  allNodes,
  depth = 0,
  selectedNodeId,
  onNodeClick,
  dragProps,
  annotationEditingProps,
  onEditAnnotation,
  onRemoveAnnotation
}: IProps): JSX.Element {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const mainMatchColor: IColor | undefined = matches.find(({userValue}) => currentNode.id === userValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const editedAnnotation = currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === currentNode.id
    ? currentSelection
    : undefined;

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({id}) => id === focusedAnnotationId)
    : undefined;

  return (
    <>
      <section style={{paddingLeft: `${indentPerRow * depth}px`}} className="grid grid-cols-2 gap-2">
        <FlatNodeText
          side={SideSelector.User}
          selectionState={selectionState}
          depth={depth}
          node={currentNode}
          dragProps={dragProps}
          mainMatchColor={mainMatchColor}
          onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}
          currentEditedAnnotation={editedAnnotation?.annotationInput}
          focusedAnnotation={focusedAnnotation}/>

        <section>
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView
              key={annotation.id}
              annotation={annotation}
              isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)}
              onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editAnnotation={() => onEditAnnotation(currentNode.id, annotation.id)}
              removeAnnotation={() => onRemoveAnnotation(currentNode.id, annotation.id)}/>
          )}

          {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps}/>}
        </section>
      </section>

      <div>
        {getFlatSolutionNodeChildren(allNodes, currentNode.id).map((child) =>
          <UserSolutionNodeDisplay
            key={child.childIndex}
            matches={matches}
            currentNode={child}
            allNodes={allNodes}
            depth={depth + 1}
            selectedNodeId={selectedNodeId}
            onNodeClick={onNodeClick}
            dragProps={dragProps}
            currentSelection={currentSelection}
            annotationEditingProps={annotationEditingProps}
            onEditAnnotation={onEditAnnotation}
            onRemoveAnnotation={onRemoveAnnotation}/>
        )}
      </div>
    </>
  );
}
