import { ReactElement } from 'react';
import { AnnotationFragment } from '../graphql';
import { DeleteIcon, EditIcon } from '../icons';
import { borderColorForErrorType, importanceFontStyle } from '../model/enums';
import classNames from 'classnames';

export interface EditAnnotationProps {
  editAnnotation: () => void;
  removeAnnotation: () => void;
}

interface IProps {
  annotation: AnnotationFragment;
  isHighlighted: boolean;
  editProps?: EditAnnotationProps;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function AnnotationView({ annotation, isHighlighted, editProps, onMouseEnter, onMouseLeave }: IProps): ReactElement {

  const { text, errorType, importance } = annotation;

  const classes = classNames('p-2 rounded border-2', { 'font-bold': isHighlighted }, borderColorForErrorType(errorType), importanceFontStyle(importance));

  return (
    <div className={classes} {...{ onMouseEnter, onMouseLeave }}>
      {text}

      {editProps && <div className="float-right">
        <button type="button" className="px-2 text-blue-600 font-bold" onClick={editProps.editAnnotation}><EditIcon /></button>
        <button type="button" className="px-2 text-red-600 font-bold" onClick={editProps.removeAnnotation}><DeleteIcon /></button>
      </div>}
    </div>
  );
}
