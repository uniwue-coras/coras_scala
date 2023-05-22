import {FlatNodeText} from './FlatNodeText';
import {SideSelector} from './CorrectSolutionView';
import {getSelectionState, SelectionState} from './selectionState';
import {IColor} from '../colors';
import {AnnotationEditingProps} from './AnnotationEditor';
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
  depth
}: NodeDisplayProps<FlatUserSolutionNodeFragment>): JSX.Element {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? currentNode.annotations.find(({id}) => id === focusedAnnotationId)
    : undefined;

  const mainMatchColor: IColor | undefined = matches.find(({userValue}) => currentNode.id === userValue)?.color;

  const selectionState: SelectionState = getSelectionState(selectedNodeId, currentNode.id);

  const editedAnnotation = /*currentSelection !== undefined && currentSelection._type === 'CreateOrEditAnnotationData' && currentSelection.nodeId === currentNode.id
    ? currentSelection
: */
    undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <section className="col-span-2 flex">
        <FlatNodeText side={SideSelector.User} selectionState={selectionState} depth={depth} node={currentNode} dragProps={dragProps}
          mainMatchColor={mainMatchColor} onClick={() => selectionState === SelectionState.This ? onNodeClick() : onNodeClick(currentNode.id)}
          currentEditedAnnotation={undefined /* TODO: editedAnnotation?.annotationInput */} focusedAnnotation={focusedAnnotation}/>

        <div className="ml-8">
          {currentNode.annotations.map((annotation: AnnotationFragment) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editAnnotation={() => void 0 /*onEditAnnotation(currentNode.id, annotation.id)*/}
              removeAnnotation={() => void 0 /* onRemoveAnnotation(currentNode.id, annotation.id)*/}/>
          )}
        </div>
      </section>

      <section>
        {/* editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps}/> */}

        {matchEditData && matchEditData.markedNodeSide === SideSelector.User && matchEditData.markedNode.id === currentNode.id &&
          <MatchEdit {...matchEditData} />}
      </section>
    </div>
  );
}

export function NewUserSolutionNodeDisplay(props /*{
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
  onRemoveAnnotation,
  matchEditData
}*/: IProps): JSX.Element {
  return (
    <BasicNodeDisplay {...props}/* matches={matches} currentNode={currentNode} allNodes={allNodes} depth={depth} selectedNodeId={selectedNodeId} onNodeClick={onNodeClick}
      dragProps={dragProps} matchEditData={matchEditData}*/>
      {(textProps) => <UserNodeTextDisplay {...textProps}/>}
    </BasicNodeDisplay>
  );
}
