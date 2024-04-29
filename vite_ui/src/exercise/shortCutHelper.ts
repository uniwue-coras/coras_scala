import { isDefined } from '../funcs';
import { AnnotationImportance, ErrorType } from '../graphql';
import { annotationInput, createOrEditAnnotationData, CreateOrEditAnnotationData } from './currentSelection';

function getSingleSelectionRange(): Range | undefined {
  const selection = window.getSelection();

  return selection !== null && selection.rangeCount === 1
    ? selection.getRangeAt(0)
    : undefined;
}

const nodeRegex = /node_user_(?<id>\d+)/;

export const readSelection = (errorType: ErrorType): CreateOrEditAnnotationData | undefined => {
  const range = getSingleSelectionRange();

  if (!isDefined(range)) {
    return undefined;
  }

  if (range.startContainer !== range.endContainer) {
    alert('TODO: internal error #1: startContainer of marked text is different from endContainer');
    return undefined;
  }

  if (!(range.startContainer instanceof Text)) {
    // TODO: container must be Text?
    alert('TODO: internal error #2: marked text is not in a text element!');
    return undefined;
  }

  const parentId = ((range.startContainer.parentNode as Element).parentNode as Element).id;

  const match = nodeRegex.exec(parentId);

  if (match === null || match.groups === undefined) {
    alert(`TODO: internal error #4: couldn't match id ${parentId}`);
    return undefined;
  }

  return createOrEditAnnotationData(
    parseInt(match.groups.id),
    undefined,
    annotationInput(errorType, AnnotationImportance.Less, range.startOffset, range.endOffset, '',),
    range.startContainer.length,
  );
};
