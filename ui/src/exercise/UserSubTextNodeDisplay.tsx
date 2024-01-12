import { ReactElement, useState } from 'react';
import { FlatUserSolutionNodeFragment } from '../graphql';
import { stringifyApplicability } from '../model/applicability';
import { AnnotationView } from './AnnotationView';

interface IProps {
  node: FlatUserSolutionNodeFragment;
}

export function UserSubTextNodesDisplay({ node: { subTextNodes } }: IProps): ReactElement {

  const [focusedAnnotationId, setFocusedAnnotationId] = useState<number>();

  return (
    <>
      {subTextNodes.map(({ text, applicability, annotations }) =>
        <div key={text} className="flex space-x-4">
          <div>{text} {stringifyApplicability(applicability)}</div>

          <div>
            {annotations.toSorted((a1, a2) => a1.id - a2.id).map((annotation) =>
              <AnnotationView key={annotation.id} annotation={annotation} isHighlighted={annotation.id === focusedAnnotationId}
                onMouseEnter={() => setFocusedAnnotationId(annotation.id)} onMouseLeave={() => setFocusedAnnotationId(undefined)} />
            )}
          </div>

        </div>)}
    </>
  );
}
