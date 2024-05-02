import { ReactElement, useState } from 'react';
import { Correctness, ParagraphCitationAnnotationFragment } from '../../graphql';
import { useTranslation } from 'react-i18next';
import { CancelIcon, CheckmarkIcon, DeleteIcon, EditIcon } from '../../icons';
import { CorrectnessIcon } from '../CorrectnessIcon';
import { correctnessTextColor } from '../../model/correctness';
import { nextCorrectness } from '../../correctness';
import classNames from 'classnames';

interface CommonProps {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onDeleteParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, awaitedParagraph: string) => void;
  onUpdateParagraphCitationAnnotationCorrectness: (sampleNodeId: number, userNodeId: number, awaitedParagraph: string, newCorrectness: Correctness) => void;
  onUpdateParagraphCitationAnnotationExplanation: (sampleNodeId: number, userNodeId: number, awaitedParagraph: string, explanation: string) => Promise<void>;

}

interface SubIProps extends CommonProps {
  annotation: ParagraphCitationAnnotationFragment;
}

function ParagraphCitationAnnotationView({
  annotation,
  setKeyHandlingEnabled,
  onDeleteParagraphCitationAnnotation,
  onUpdateParagraphCitationAnnotationCorrectness,
  onUpdateParagraphCitationAnnotationExplanation
}: SubIProps): ReactElement {

  const { sampleNodeId, userNodeId, awaitedParagraph, correctness/*, citedParagraph*/, explanation } = annotation;

  const { t } = useTranslation('common');
  const [newExplanation, setNewExplanation] = useState<string>();

  const updateEditedAnnotation = async () => {
    if (newExplanation === undefined || newExplanation.trim().length === 0) {
      return;
    }

    try {
      await onUpdateParagraphCitationAnnotationExplanation(sampleNodeId, userNodeId, awaitedParagraph, newExplanation);

      setNewExplanation(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const updateParagraphCitationCorrectness = () => {
    onUpdateParagraphCitationAnnotationCorrectness(sampleNodeId, userNodeId, awaitedParagraph, nextCorrectness(correctness));
  };

  const deleteParagraphCitationAnnotation = () => {
    if (confirm(t('reallyDeleteParagraphCitationAnnotation?'))) {
      onDeleteParagraphCitationAnnotation(sampleNodeId, userNodeId, awaitedParagraph);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-2">
      <button className={classNames(correctnessTextColor(correctness))} onClick={updateParagraphCitationCorrectness}>
        <CorrectnessIcon correctness={correctness} />
      </button>
      <span>{awaitedParagraph}</span>
      {explanation && newExplanation === undefined && <div className="font-bold flex-auto">{explanation}</div>}
      {newExplanation !== undefined
        ? (
          <>
            <input className="flex-auto p-2 rounded border border-slate-500" defaultValue={newExplanation} onChange={(event) => setNewExplanation(event.target.value)}
              onFocus={() => setKeyHandlingEnabled(false)} onBlur={() => setKeyHandlingEnabled(true)} />

            <button type="button" className="p-2 rounded bg-red-500 text-white" onClick={() => setNewExplanation(undefined)}>
              <CancelIcon />
            </button>
            <button type="button" className="p-2 rounded bg-blue-500 text-white" onClick={() => updateEditedAnnotation()}><CheckmarkIcon /></button>
          </>
        )
        : (
          <>
            <button type="button" className="text-amber-600" title={t('edit')} onClick={() => setNewExplanation(explanation || '')}><EditIcon /></button>
            <button type="button" className="text-red-600" title={t('delete')} onClick={deleteParagraphCitationAnnotation}><DeleteIcon /></button>
          </>
        )}
    </div>
  );
}

interface IProps extends CommonProps {
  paragraphCitationAnnotations: ParagraphCitationAnnotationFragment[];
}

export function ParagraphCitationAnnotationsView({ paragraphCitationAnnotations, ...funcs }: IProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="p-2 rounded border border-red-600">
      <span className="font-bold">{t('missingOrWrongParagraphCitation(s)')}:</span>

      {paragraphCitationAnnotations.map((annotation) => <ParagraphCitationAnnotationView key={annotation.awaitedParagraph} {...{ annotation, ...funcs }} />)}
    </div>
  );
}
