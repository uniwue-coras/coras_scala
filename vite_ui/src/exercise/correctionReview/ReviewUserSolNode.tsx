import { NodeDisplayProps } from '../nodeDisplayProps';
import { ReactElement, useState } from 'react';
import { UserSolutionNodeFragment } from '../../graphql';
import { FlatNodeText } from '../FlatNodeText';
import { AnnotationView } from '../AnnotationView';

export function ReviewUserSolNode({ node, ...otherProps }: NodeDisplayProps<UserSolutionNodeFragment>): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? node.annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...otherProps} node={node} focusedAnnotation={focusedAnnotation} onDragDrop={async () => void 0} />

      <div>
        {node.annotations.map((annotation) => <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
          onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)} />)}
      </div>
    </div>
  );
}
