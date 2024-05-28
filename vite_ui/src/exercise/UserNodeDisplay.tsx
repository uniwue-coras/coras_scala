import { FlatNodeText } from './FlatNodeText';
import { AnnotationEditingProps, AnnotationEditor } from './correction/AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from './AnnotationView';
import { UserSolutionNodeFragment } from '../graphql';
import { isDefined } from '../funcs';
import { MatchEditFuncs, MatchOverview } from './correction/MatchOverview';
import { CreateOrEditAnnotationData } from './currentSelection';
import { NodeDisplayProps } from './nodeDisplayProps';

export interface AnnotationEditFuncs extends AnnotationEditingProps {
  matchEditFuncs: MatchEditFuncs;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
  onDragDrop: (sampleId: number, userId: number) => Promise<void>;
}

interface IProps extends NodeDisplayProps<UserSolutionNodeFragment> {
  currentSelection: CreateOrEditAnnotationData | undefined;
  annotationEditFuncs?: AnnotationEditFuncs | undefined;
}

export function UserNodeDisplay({ node, depth, index, currentSelection, ownMatches, annotationEditFuncs }: IProps): ReactElement {

  const { isSubText, annotations } = node;

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = isDefined(focusedAnnotationId)
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const editedAnnotation = isDefined(currentSelection) && currentSelection.nodeId === node.id
    ? currentSelection
    : undefined;

  const editAnnotationProps = (annotationId: number): EditAnnotationProps | undefined => annotationEditFuncs
    ? {
      editAnnotation: () => annotationEditFuncs.onEditAnnotation(node.id, annotationId),
      removeAnnotation: () => annotationEditFuncs.onRemoveAnnotation(node.id, annotationId)
    }
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...{ node, ownMatches, index, depth, focusedAnnotation }} onDragDrop={annotationEditFuncs?.onDragDrop} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div>
        {!isSubText && ownMatches.map((match) => <MatchOverview key={match.sampleNodeId} match={match} editFuncs={annotationEditFuncs?.matchEditFuncs} />)}

        <div className="space-y-2">
          {annotations.map((annotation) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editProps={editAnnotationProps(annotation.id)} />
          )}

          {annotationEditFuncs && editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation}
            onSubmitAnnotation={annotationEditFuncs.onSubmitAnnotation}
            onCancelAnnotationEdit={annotationEditFuncs.onCancelAnnotationEdit} />}
        </div>
      </div>

    </div>
  );
}
