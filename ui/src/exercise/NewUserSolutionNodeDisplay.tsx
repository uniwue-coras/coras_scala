import {FlatNodeText} from './FlatNodeText';
import {SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {IColor} from '../colors';
import {AnnotationEditingProps, AnnotationEditor} from './AnnotationEditor';
import {JSX, useState} from 'react';
import {AnnotationView} from './AnnotationView';
import {AnnotationFragment, FlatUserSolutionNodeFragment} from '../graphql';
import {CurrentSelection} from './currentSelection';
import {MatchEdit} from './MatchEdit';
import {BasicNodeDisplay, NodeDisplayProps} from './BasicNodeDisplay';

interface IProps extends NodeDisplayProps<FlatUserSolutionNodeFragment> {
  currentSelection?: CurrentSelection;
  annotationEditingProps: AnnotationEditingProps;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

function UserNodeTextDisplay({
  currentNode,
  allNodes,
  selectedNodeId,
  onNodeClick,
  dragProps,
  matches,
  matchEditData,
  depth,
  currentSelection, onRemoveAnnotation, onEditAnnotation, annotationEditingProps
}: IProps): JSX.Element {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({id}) => id === focusedAnnotationId)
    : undefined;

  const mainMatchColor: IColor | undefined = matches.find(({userValue}) => currentNode.id === userValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const editedAnnotation = currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === currentNode.id
    ? currentSelection
    : undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <section className="col-span-2 flex">
        <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
          mainMatchColor={mainMatchColor} onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}
          currentEditedAnnotation={editedAnnotation?.annotationInput} focusedAnnotation={focusedAnnotation}/>

        <div className="ml-8">
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editAnnotation={() => onEditAnnotation(currentNode.id, annotation.id)}
              removeAnnotation={() => onRemoveAnnotation(currentNode.id, annotation.id)}/>
          )}
        </div>
      </section>

      <section>
        {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps}/>}

        {matchEditData && matchEditData.markedNodeSide === SideSelector.User && matchEditData.markedNode.id === currentNode.id &&
          <MatchEdit {...matchEditData} />}
      </section>
    </div>
  );
}

export function NewUserSolutionNodeDisplay(props: IProps): JSX.Element {
  return (
    <BasicNodeDisplay otherProps={props}>
      {(textProps) => <UserNodeTextDisplay {...textProps}/>}
    </BasicNodeDisplay>
  );
}
