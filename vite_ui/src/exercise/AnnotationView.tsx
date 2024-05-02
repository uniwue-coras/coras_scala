import { ReactElement } from 'react';
import { AnnotationFragment, AnnotationImportance, ErrorType } from '../graphql';
import classNames from 'classnames';
import { DeleteIcon, EditIcon } from '../icons';

export interface EditAnnotationProps {
  editAnnotation: () => void;
  removeAnnotation: () => void;
}

interface IProps {
  annotation: AnnotationFragment;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  editProps?: EditAnnotationProps;
}

export function AnnotationView({ annotation, isHighlighted, onMouseEnter, onMouseLeave, editProps }: IProps): ReactElement {

  const { text, errorType, importance } = annotation;

  const borderColor = {
    [ErrorType.Neutral]: 'border-slate-500',
    [ErrorType.Wrong]: 'border-red-500',
    [ErrorType.Missing]: 'border-amber-500',
  }[errorType];

  const className = classNames('my-2 p-2 rounded border-2', borderColor, { 'font-bold': isHighlighted }, {
    [AnnotationImportance.Less]: 'italic',
    [AnnotationImportance.Medium]: '',
    [AnnotationImportance.More]: 'font-bold'
  }[importance]);

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {text}

      {editProps && <div className="float-right">
        <button type="button" className="px-2 text-blue-600 font-bold" onClick={editProps.editAnnotation}><EditIcon /></button>
        <button type="button" className="px-2 text-red-600 font-bold" onClick={editProps.removeAnnotation}><DeleteIcon /></button>
      </div>}
    </div>
  );
}
