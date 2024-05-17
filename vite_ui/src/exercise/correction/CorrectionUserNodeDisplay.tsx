import { FlatNodeText } from '../FlatNodeText';
import { AnnotationEditingProps, AnnotationEditor } from './AnnotationEditor';
import { ReactElement, useState } from 'react';
import { AnnotationView, EditAnnotationProps } from '../AnnotationView';
import { UserSolutionNodeFragment } from '../../graphql';
import { CorrectionNodeDisplayProps } from '../nodeDisplayProps';
import { isDefined } from '../../funcs';
import { MatchEditFuncs, MatchOverview } from './MatchOverview';
import { CreateOrEditAnnotationData } from '../currentSelection';

interface IProps extends CorrectionNodeDisplayProps<UserSolutionNodeFragment> {
  exerciseId: number;
  username: string;
  currentSelection: CreateOrEditAnnotationData | undefined;
  annotationEditingProps: AnnotationEditingProps;
  matchEditFuncs: MatchEditFuncs;
  onEditAnnotation: (nodeId: number, annotationId: number) => void;
  onRemoveAnnotation: (nodeId: number, annotationId: number) => void;
}

export function CorrectionUserNodeDisplay({
  exerciseId,
  username,
  node,
  currentSelection,
  annotationEditingProps,
  ownMatches,
  matchEditFuncs,
  onRemoveAnnotation,
  onEditAnnotation,
  ...otherProps
}: IProps): ReactElement {

  const { isSubText, annotations } = node;

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = isDefined(focusedAnnotationId)
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  const editedAnnotation = isDefined(currentSelection) && currentSelection.nodeId === node.id
    ? currentSelection
    : undefined;

  const editAnnotationProps = (annotationId: number): EditAnnotationProps => ({
    editAnnotation: () => onEditAnnotation(node.id, annotationId),
    removeAnnotation: () => onRemoveAnnotation(node.id, annotationId)
  });

  return (
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...otherProps} {...{ node, ownMatches, focusedAnnotation }} currentEditedAnnotation={editedAnnotation?.annotationInput} />

      <div>
        {!isSubText && ownMatches.map((match) => <MatchOverview key={match.sampleNodeId} {...{ exerciseId, username, match }} {...matchEditFuncs} />)}

        <div className="space-y-2">
          {annotations.map((annotation) =>
            <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
              onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)}
              editProps={editAnnotationProps(annotation.id)} />
          )}

          {editedAnnotation && <AnnotationEditor annotationInputData={editedAnnotation} {...annotationEditingProps} />}
        </div>
      </div>

    </div>
  );
}
