import { CreateOrEditAnnotationData } from './currentSelection';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import update, { Spec } from 'immutability-helper';
import { AnnotationImportance, AnnotationInput, ErrorType } from '../graphql';
import { RecommendationSelect } from './RecommendationSelect';
import classNames from 'classnames';

export interface AnnotationEditingProps {
  // onUpdateAnnotation: (spec: Spec<AnnotationInput>) => void;
  onCancelAnnotationEdit: () => void;
  onSubmitAnnotation: (annotation: AnnotationInput) => void;
}

interface IProps extends AnnotationEditingProps {
  annotationInputData: CreateOrEditAnnotationData;
}

const errorTypes: ErrorType[] = [ErrorType.Missing, ErrorType.Wrong];
const importanceTypes: AnnotationImportance[] = [AnnotationImportance.Less, AnnotationImportance.Medium, AnnotationImportance.More];

const buttonClasses = (selected: boolean) => classNames('p-2 rounded flex-grow', selected ? 'bg-blue-500 text-white' : 'border border-slate-500');

export function AnnotationEditor({ annotationInputData, onCancelAnnotationEdit, onSubmitAnnotation/*, onUpdateAnnotation*/ }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [recommendations, setRecommendations] = useState(annotationInputData.textRecommendations);
  const [annotation, setAnnotation] = useState(annotationInputData.annotationInput);

  const { errorType, importance, startIndex, endIndex, text } = annotation;

  const onUpdateAnnotation = (spec: Spec<AnnotationInput>) => setAnnotation((annotation) => update(annotation, spec));

  const setComment = (comment: string) => {
    if (comment.startsWith('!') && importance === AnnotationImportance.Less) {
      onUpdateAnnotation({ importance: { $set: AnnotationImportance.Medium } });
    } else if (comment.startsWith('!') && importance === AnnotationImportance.Medium) {
      onUpdateAnnotation({ importance: { $set: AnnotationImportance.More } });
    } else {
      onUpdateAnnotation({ text: { $set: comment } });
    }
  };

  const submit = (): void => onSubmitAnnotation(annotation);

  const enterKeyDownEventListener = (event: KeyboardEvent): void => {
    event.key === 'Enter' && submit();
  };

  useEffect(() => {
    addEventListener('keydown', enterKeyDownEventListener);
    return () => removeEventListener('keydown', enterKeyDownEventListener);
  });

  const hideRecommendations = (): void => setRecommendations(undefined);

  // FIXME: implement!
  const selectRecommendation = (value: string): void => {
    setAnnotation((annotation) => update(annotation, { text: { $set: value } }));
    hideRecommendations();
  };

  return (
    <div className="p-2 rounded border border-slate-500">

      <div className="mb-2 flex space-x-2 justify-center">
        {errorTypes.map((anErrorType) =>
          <button type="button" key={anErrorType} onClick={() => onUpdateAnnotation({ errorType: { $set: anErrorType } })}
            className={buttonClasses(anErrorType === errorType)}>
            {anErrorType}
          </button>)}
      </div>

      <div className="my-2 flex space-x-2">
        {importanceTypes.map((anImportance) =>
          <button type="button" key={anImportance} onClick={() => onUpdateAnnotation({ importance: { $set: anImportance } })}
            className={buttonClasses(anImportance === importance)}>
            {anImportance}
          </button>)}
      </div>

      <div className="my-2 grid grid-cols-2 gap-2">
        <input type="range" min={0} defaultValue={startIndex} max={endIndex - 1} className="p-2 w-full"
          onChange={(event) => onUpdateAnnotation({ startIndex: { $set: parseInt(event.target.value) } })} />

        <input type="range" min={startIndex} defaultValue={endIndex} max={annotationInputData.maxEndOffset} className="p-2 w-full"
          onChange={(event) => onUpdateAnnotation({ endIndex: { $set: parseInt(event.target.value) } })} />
      </div>

      {recommendations && <div className="my-2">
        <RecommendationSelect recommendations={recommendations} hideRecommendations={hideRecommendations} onSelect={selectRecommendation} />
      </div>}

      <div className="my-2">
        <textarea value={text} placeholder={t('comment') || undefined} className="p-2 rounded border border-slate-500 w-full"
          onChange={(event) => setComment(event.target.value)} autoFocus />
      </div>

      <div className="my-2 grid grid-cols-2 gap-2">
        <button type="button" className="p-2 rounded border border-slate-500" onClick={onCancelAnnotationEdit}>{t('cancel')}</button>
        <button type="button" className="p-2 rounded bg-blue-500 text-white" onClick={submit}>{t('submit')}</button>
      </div>
    </div>
  );
}
