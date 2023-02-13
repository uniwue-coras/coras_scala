import {ErrorType} from './CorrectionColumn';

function ifDefined<T, S>(t: T | undefined, f: (t: T) => S): S | undefined {
  return t !== undefined ? f(t) : undefined;
}

export interface IAnnotation {
  _type: 'IAnnotation';
  errorType: ErrorType;
  nodeId: number;
  startOffset: number;
  endOffset: number;
  maxEndOffset: number;
  comment: string;
}

function getSingleSelectionRange(): Range | undefined {
  const selection = window.getSelection();

  return selection !== null && selection.rangeCount === 1
    ? selection.getRangeAt(0)
    : undefined;
}

const nodeRegex = /node_(?<side>user|sample)_(?<id>\d+)/;

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

    if (match.groups.side !== 'user') {
      // FIXME: side shouldn't be 'sample'?
      alert('TODO: internal error #3: can\'t mark in sample solution nodes yet!');
      return undefined;
    }

    return {
      _type: 'IAnnotation',
      errorType,
      nodeId: parseInt(match.groups.id),
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      maxEndOffset: range.startContainer.length,
      comment: ''
    };
  }
);
