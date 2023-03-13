import classNames from 'classnames';
import {AnnotationFragment, ErrorType} from '../graphql';

interface IProps {
  annotation: AnnotationFragment;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  removeAnnotation: () => void;
}

export function AnnotationView({annotation: {text, errorType}, isHighlighted, onMouseEnter, onMouseLeave, removeAnnotation}: IProps): JSX.Element {
  const borderColor = {
    [ErrorType.Wrong]: 'border-red-500',
    [ErrorType.Missing]: 'border-amber-500',
  }[errorType];

  const className = classNames('my-2 p-2 rounded border', borderColor, {'font-bold': isHighlighted});

  return (

    // FIXME: remove annotation button?
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {text}
      <button type="button" className="float-right text-red-600 font-bold" onClick={removeAnnotation}>X</button>
    </div>
  );
}
