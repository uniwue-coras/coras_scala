import classNames from 'classnames';
import {IAnnotation} from './shortCutHelper';
import {ErrorType} from './CorrectionColumn';

interface IProps {
  annotation: IAnnotation;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function AnnotationView({annotation: {comment, errorType}, isHighlighted, onMouseEnter, onMouseLeave}: IProps): JSX.Element {

  const borderColor = {
    [ErrorType.Wrong]: 'border-red-500',
    [ErrorType.Missing]: 'border-amber-500',
  }[errorType];

  const className = classNames('my-2 p-2 rounded border', borderColor, {'font-bold': isHighlighted});

  return (

    // FIXME: remove annotation button?
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {comment}
    </div>
  );
}
