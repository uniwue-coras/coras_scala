import classNames from 'classnames';
import {AnnotationFragment, ErrorType} from '../graphql';

interface IProps {
  annotation: AnnotationFragment;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  editAnnotation: () => void;
  removeAnnotation: () => void;
}

export function AnnotationView({annotation, isHighlighted, onMouseEnter, onMouseLeave, editAnnotation, removeAnnotation}: IProps): JSX.Element {

  const {text, errorType} = annotation;

  const borderColor = {
    [ErrorType.Wrong]: 'border-red-500',
    [ErrorType.Missing]: 'border-amber-500',
  }[errorType];

  const className = classNames('my-2 p-2 rounded border', borderColor, {'font-bold': isHighlighted});

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {text}
      <div className="float-right">
        <button type="button" className="px-2 text-blue-600 font-bold" onClick={editAnnotation}>&#x270E;</button>
        <button type="button" className="px-2 text-red-600 font-bold" onClick={removeAnnotation}>&#x232B;</button>
      </div>
    </div>
  );
}
