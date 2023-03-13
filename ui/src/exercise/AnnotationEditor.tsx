import {IAnnotation} from './shortCutHelper';
import {errorTypes} from './CorrectionColumn';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';
import {Spec} from 'immutability-helper';
import {AnnotationFragment, ErrorType} from '../graphql';

export interface AnnotationEditingProps {
  updateAnnotation: (spec: Spec<AnnotationFragment>) => void;
  cancelAnnotation: () => void;
  submitAnnotation: () => void;
}

interface IProps extends AnnotationEditingProps {
  annotation: IAnnotation;
}

export function AnnotationEditor({annotation, cancelAnnotation, submitAnnotation, updateAnnotation}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const setErrorType = (errorType: ErrorType) => updateAnnotation({errorType: {$set: errorType}});
  const setComment = (comment: string) => updateAnnotation({text: {$set: comment}});

  const setStartOffset = (startOffset: number) => updateAnnotation({startIndex: {$set: startOffset}});
  const setEndOffset = (endOffset: number) => updateAnnotation({endIndex: {$set: endOffset}});

  const enterKeyDownEventListener = (event: KeyboardEvent) => {
    event.key === 'Enter' && submitAnnotation();
  };

  useEffect(() => {
    addEventListener('keydown', enterKeyDownEventListener);
    return () => removeEventListener('keydown', enterKeyDownEventListener);
  });


  return (
    <div>

      <div className="my-4 flex justify-center">
        {errorTypes.map((errorType) =>
          <button key={errorType} type="button" onClick={() => setErrorType(errorType)}
                  className={classNames('mx-2 p-2 rounded', errorType === annotation.annotation.errorType ? 'bg-blue-500 text-white' : 'border border-slate-500')}>
            {errorType}
          </button>)}
      </div>

      <div className="my-4">
        <input type="range" min={0} defaultValue={annotation.annotation.startIndex} max={annotation.annotation.endIndex - 1} className="p-2 w-full"
               onChange={(event) => setStartOffset(parseInt(event.target.value))}/>

        <input type="range" min={annotation.annotation.startIndex} defaultValue={annotation.annotation.endIndex} max={annotation.maxEndOffset}
               className="p-2 w-full"
               onChange={(event) => setEndOffset(parseInt(event.target.value))}/>
      </div>

      <div className="my-4">
        <textarea defaultValue={annotation.annotation.text} placeholder={t('comment') || undefined} className="p-2 rounded border border-slate-500 w-full"
                  onChange={(event) => setComment(event.target.value)} autoFocus/>
      </div>

      <div className="my-4 flex justify-center">
        <button type="button" className="mx-2 p-2 rounded border border-slate-500" onClick={cancelAnnotation}>{t('cancel')}</button>
        <button type="button" className="mx-2 p-2 rounded bg-blue-500 text-white" onClick={submitAnnotation}>{t('submit')}</button>
      </div>
    </div>
  );
}
