import { CreateOrEditAnnotationData } from '../currentSelection';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Importance, AnnotationInput } from '../../graphql';
import update, { Spec } from 'immutability-helper';
import classNames from 'classnames';
import { errorTypes, importanceTypes } from '../../model/enums';

export interface AnnotationEditingProps {
  onCancelAnnotationEdit: () => void;
  onSubmitAnnotation: (annotation: AnnotationInput) => void;
}

interface IProps extends AnnotationEditingProps {
  annotationInputData: CreateOrEditAnnotationData;
}


const buttonClasses = (selected: boolean) => classNames('p-2 rounded flex-grow', selected ? 'bg-blue-500 text-white' : 'border border-slate-500');

export function AnnotationEditor({ annotationInputData, onCancelAnnotationEdit, onSubmitAnnotation }: IProps): ReactElement {

  const { annotationInput, maxEndOffset } = annotationInputData;

  const { t } = useTranslation('common');
  const [annotation, setAnnotation] = useState(annotationInput);

  const { errorType, importance, startIndex, endIndex, text } = annotation;

  const onUpdateAnnotation = (spec: Spec<AnnotationInput>) => setAnnotation((annotation) => update(annotation, spec));

  const setComment = (comment: string) => {
    if (comment.startsWith('!') && importance === Importance.Less) {
      onUpdateAnnotation({ importance: { $set: Importance.Medium } });
    } else if (comment.startsWith('!') && importance === Importance.Medium) {
      onUpdateAnnotation({ importance: { $set: Importance.More } });
    } else {
      onUpdateAnnotation({ text: { $set: comment } });
    }
  };

  const submit = (): void => onSubmitAnnotation(annotation);

  const enterKeyDownEventListener = (event: KeyboardEvent): void => { event.key === 'Enter' && submit(); };

  useEffect(() => {
    addEventListener('keydown', enterKeyDownEventListener);
    return () => removeEventListener('keydown', enterKeyDownEventListener);
  });

  return (
    <div className="p-2 rounded border border-slate-500">

      <div className="grid grid-cols-2 gap-4">
        <div className={`grid grid-cols-${errorTypes.length} gap-2`}>
          {errorTypes.map((anErrorType) =>
            <button type="button" key={anErrorType} onClick={() => onUpdateAnnotation({ errorType: { $set: anErrorType } })}
              className={buttonClasses(anErrorType === errorType)}>
              {anErrorType}
            </button>)}
        </div>

        <div className={`grid grid-cols-${importanceTypes.length} gap-2`}>
          {importanceTypes.map((anImportance) =>
            <button type="button" key={anImportance} onClick={() => onUpdateAnnotation({ importance: { $set: anImportance } })}
              className={buttonClasses(anImportance === importance)}>
              {anImportance}
            </button>)}
        </div>
      </div>

      <div className="my-2 grid grid-cols-2 gap-4">
        <input type="range" min={0} defaultValue={startIndex} max={endIndex - 1} className="p-2 w-full"
          onChange={(event) => onUpdateAnnotation({ startIndex: { $set: parseInt(event.target.value) } })} />

        <input type="range" min={startIndex} defaultValue={endIndex} max={maxEndOffset} className="p-2 w-full"
          onChange={(event) => onUpdateAnnotation({ endIndex: { $set: parseInt(event.target.value) } })} />
      </div>

      <div className="my-2">
        <textarea value={text} placeholder={t('comment')} className="p-2 rounded border border-slate-500 w-full"
          onChange={(event) => setComment(event.target.value)} autoFocus />
      </div>

      <div className="my-2 grid grid-cols-2 gap-4">
        <button type="button" className="p-2 rounded border border-slate-500" onClick={onCancelAnnotationEdit}>{t('cancel')}</button>
        <button type="button" className="p-2 rounded bg-blue-500 text-white" onClick={submit}>{t('submit')}</button>
      </div>
    </div>
  );
}
