import {CreateOrEditAnnotationData} from './currentSelection';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';
import {Spec} from 'immutability-helper';
import {AnnotationInput, ErrorType} from '../graphql';

export interface AnnotationEditingProps {
  onUpdateAnnotation: (spec: Spec<AnnotationInput>) => void;
  onCancelAnnotationEdit: () => void;
  onSubmitAnnotation: () => void;
}

interface IProps extends AnnotationEditingProps {
  annotationInputData: CreateOrEditAnnotationData;
}

export const errorTypes: ErrorType[] = [ErrorType.Missing, ErrorType.Wrong];

export function AnnotationEditor({annotationInputData, onCancelAnnotationEdit, onSubmitAnnotation, onUpdateAnnotation}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const setErrorType = (errorType: ErrorType) => onUpdateAnnotation({errorType: {$set: errorType}});
  const setComment = (comment: string) => onUpdateAnnotation({text: {$set: comment}});

  const setStartOffset = (startOffset: number) => onUpdateAnnotation({startIndex: {$set: startOffset}});
  const setEndOffset = (endOffset: number) => onUpdateAnnotation({endIndex: {$set: endOffset}});

  const enterKeyDownEventListener = (event: KeyboardEvent) => {
    event.key === 'Enter' && onSubmitAnnotation();
  };

  useEffect(() => {
    addEventListener('keydown', enterKeyDownEventListener);
    return () => removeEventListener('keydown', enterKeyDownEventListener);
  });

  const {errorType, startIndex, endIndex, text} = annotationInputData.annotationInput;

  return (
    <div>

      <div className="my-4 flex justify-center">
        {errorTypes.map((anErrorType) =>
          <button key={anErrorType} type="button" onClick={() => setErrorType(anErrorType)}
                  className={classNames('mx-2 p-2 rounded', anErrorType === errorType ? 'bg-blue-500 text-white' : 'border border-slate-500')}>
            {anErrorType}
          </button>)}
      </div>

      <div className="my-4">
        <input type="range" min={0} defaultValue={startIndex} max={endIndex - 1} className="p-2 w-full"
               onChange={(event) => setStartOffset(parseInt(event.target.value))}/>

        <input type="range" min={startIndex} defaultValue={endIndex} max={annotationInputData.maxEndOffset} className="p-2 w-full"
               onChange={(event) => setEndOffset(parseInt(event.target.value))}/>
      </div>

      <div className="my-4">
        <textarea defaultValue={text} placeholder={t('comment') || undefined} className="p-2 rounded border border-slate-500 w-full"
                  onChange={(event) => setComment(event.target.value)} autoFocus/>
      </div>

      <div className="my-4 flex justify-center">
        <button type="button" className="mx-2 p-2 rounded border border-slate-500" onClick={onCancelAnnotationEdit}>{t('cancel')}</button>
        <button type="button" className="mx-2 p-2 rounded bg-blue-500 text-white" onClick={onSubmitAnnotation}>{t('submit')}</button>
      </div>
    </div>
  );
}
