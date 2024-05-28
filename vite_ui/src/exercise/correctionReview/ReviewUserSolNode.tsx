import { NodeDisplayProps } from '../nodeDisplayProps';
import { ReactElement, useState } from 'react';
import { UserSolutionNodeFragment } from '../../graphql';
import { FlatNodeText } from '../FlatNodeText';
import { AnnotationView } from '../AnnotationView';

export function ReviewUserSolNode({ node, ownMatches, ...otherProps }: NodeDisplayProps<UserSolutionNodeFragment>): ReactElement {

  const { /*isSubText,*/ annotations } = node;

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  const focusedAnnotation = focusedAnnotationId !== undefined
    ? annotations.find(({ id }) => id === focusedAnnotationId)
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-2">
      <FlatNodeText isSample={false} {...otherProps} {...{ node, ownMatches, focusedAnnotation }} onDragDrop={async () => void 0} />

      {/*!isSubText && ownMatches.map((match) => <MatchOverview key={match.sampleNodeId} {...{ exerciseId, username, match }} {...matchEditFuncs} />)*/}

      <div>
        {annotations.map((annotation) => <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
          onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)} />)}
      </div>
    </div>
  );
}
