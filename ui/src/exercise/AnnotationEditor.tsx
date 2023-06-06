import {CreateOrEditAnnotationData} from './currentSelection';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';
import {Spec} from 'immutability-helper';
import {AnnotationImportance, AnnotationInput, ErrorType} from '../graphql';

export interface AnnotationEditingProps {
  onUpdateAnnotation: (spec: Spec<AnnotationInput>) => void;
  onCancelAnnotationEdit: () => void;
  onSubmitAnnotation: () => void;
}

interface IProps extends AnnotationEditingProps {
  annotationInputData: CreateOrEditAnnotationData;
}

const errorTypes: ErrorType[] = [ErrorType.Missing, ErrorType.Wrong];
const importances: AnnotationImportance[] = [AnnotationImportance.Less, AnnotationImportance.Medium, AnnotationImportance.More];

export function AnnotationEditor({annotationInputData, onCancelAnnotationEdit, onSubmitAnnotation, onUpdateAnnotation}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {errorType, importance, startIndex, endIndex, text} = annotationInputData.annotationInput;

  const setImportance = (importance: AnnotationImportance) => onUpdateAnnotation({importance: {$set: importance}});
  const setErrorType = (errorType: ErrorType) => onUpdateAnnotation({errorType: {$set: errorType}});
  const setStartOffset = (startOffset: number) => onUpdateAnnotation({startIndex: {$set: startOffset}});
  const setEndOffset = (endOffset: number) => onUpdateAnnotation({endIndex: {$set: endOffset}});
  const setComment = (comment: string) => {
    if (comment.startsWith('!') && importance === AnnotationImportance.Less) {
      setImportance(AnnotationImportance.Medium);
    } else if (comment.startsWith('!') && importance === AnnotationImportance.Medium) {
      setImportance(AnnotationImportance.More);
    } else {
      onUpdateAnnotation({text: {$set: comment}});
    }
  };

  const enterKeyDownEventListener = (event: KeyboardEvent): void => {
    event.key === 'Enter' && onSubmitAnnotation();
  };

  useEffect(() => {
    addEventListener('keydown', enterKeyDownEventListener);
    return () => removeEventListener('keydown', enterKeyDownEventListener);
  });

  return (
    <div className="p-2 rounded border border-slate-500">

      <div className="mb-2 flex space-x-2 justify-center">
        {errorTypes.map((anErrorType) =>
          <button type="button" key={anErrorType} onClick={() => setErrorType(anErrorType)}
            className={classNames('p-2 rounded flex-grow', anErrorType === errorType ? 'bg-blue-500 text-white' : 'border border-slate-500')}>
            {anErrorType}
          </button>)}
      </div>

      <div className="my-2 flex space-x-2">
        {importances.map((anImportance) => <button type="button" key={anImportance} onClick={() => setImportance(anImportance)}
          className={classNames('p-2 rounded flex-grow', anImportance === importance ? 'bg-blue-500 text-white' : 'border border-slate-500')}>
          {anImportance}
        </button>)}
      </div>

      <div className="my-2 grid grid-cols-2 gap-2">
        <input type="range" min={0} defaultValue={startIndex} max={endIndex - 1} className="p-2 w-full"
          onChange={(event) => setStartOffset(parseInt(event.target.value))}/>

        <input type="range" min={startIndex} defaultValue={endIndex} max={annotationInputData.maxEndOffset} className="p-2 w-full"
          onChange={(event) => setEndOffset(parseInt(event.target.value))}/>
      </div>

      <div className="my-2">
        <textarea value={text} placeholder={t('comment') || undefined} className="p-2 rounded border border-slate-500 w-full"
          onChange={(event) => setComment(event.target.value)} autoFocus/>
      </div>

      <div className="my-2 grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded border border-slate-500" onClick={onCancelAnnotationEdit}>{t('cancel')}</button>
        <button type="button" className="p-2 rounded bg-blue-500 text-white" onClick={onSubmitAnnotation}>{t('submit')}</button>
      </div>
    </div>
  );
}
