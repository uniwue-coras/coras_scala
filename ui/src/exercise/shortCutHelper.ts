import {AnnotationFragment, ErrorType} from '../graphql';

function ifDefined<T, S>(t: T | undefined, f: (t: T) => S): S | undefined {
  return t !== undefined ? f(t) : undefined;
}

/**
 * FIXME: rename!
 */
export interface IAnnotation {
  _type: 'IAnnotation';
  nodeId: number;
  annotation: AnnotationFragment;
  maxEndOffset: number;
}

function getSingleSelectionRange(): Range | undefined {
  const selection = window.getSelection();

  return selection !== null && selection.rangeCount === 1
    ? selection.getRangeAt(0)
    : undefined;
}

const nodeRegex = /node_user_(?<id>\d+)/;

export const readSelection = (errorType: ErrorType): IAnnotation | undefined => ifDefined(
  getSingleSelectionRange(),
  (range) => {
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

    return {
      _type: 'IAnnotation',
      nodeId: parseInt(match.groups.id),
      annotation: {
        errorType,
        startIndex: range.startOffset,
        endIndex: range.endOffset,
        text: '',
      },
      maxEndOffset: range.startContainer.length,
    };
  }
);
