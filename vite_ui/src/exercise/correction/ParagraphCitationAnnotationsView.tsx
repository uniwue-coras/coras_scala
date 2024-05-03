import { ReactElement, useState } from 'react';
import { Correctness, ParagraphCitationAnnotationFragment, ParagraphCitationAnnotationInput } from '../../graphql';
import { useTranslation } from 'react-i18next';
import { DeleteIcon, EditIcon, LeftRightArrow, PlusIcon } from '../../icons';
import { CorrectnessIcon } from '../CorrectnessIcon';
import { correctnessTextColor } from '../../model/correctness';
import { ParagraphCitationAnnotationForm } from './ParagraphCitationAnnotationForm';
import classNames from 'classnames';

export type ParCitAnnoKey = { sampleNodeId: number, userNodeId: number, awaitedParagraph: string };

interface CommonProps {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => void;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
}

interface SubIProps extends CommonProps {
  annotation: ParagraphCitationAnnotationFragment;
}

function initEditValues({ awaitedParagraph, correctness, citedParagraph, explanation }: ParagraphCitationAnnotationFragment): ParagraphCitationAnnotationInput {
  return { awaitedParagraph, correctness, citedParagraph: citedParagraph || '', explanation: explanation || '' };
}

function ParagraphCitationAnnotationView({
  annotation,
  setKeyHandlingEnabled,
  onUpdateParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
}: SubIProps): ReactElement {

  const { sampleNodeId, userNodeId, awaitedParagraph, correctness, citedParagraph, explanation } = annotation;
  const key = { sampleNodeId, userNodeId, awaitedParagraph };

  const { t } = useTranslation('common');
  const [isEdited, setIsEdited] = useState(false);

  async function updateEditedAnnotation(paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) {
    try {
      await onUpdateParagraphCitationAnnotation(key, paragraphCitationAnnotationInput);
      setIsEdited(false);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteParagraphCitationAnnotation = () => confirm(t('reallyDeleteParagraphCitationAnnotation?')) && onDeleteParagraphCitationAnnotation(key);

  return isEdited
    ? <ParagraphCitationAnnotationForm initialValues={initEditValues(annotation)} setKeyHandlingEnabled={setKeyHandlingEnabled}
      onSubmit={updateEditedAnnotation} onCancel={() => setIsEdited(false)} />
    : (
      <div className="flex flew-row space-x-2">
        <div className={classNames(correctnessTextColor(correctness))}>
          <CorrectnessIcon correctness={correctness} />
        </div>

        <div className="flex-grow">
          <div className="flex flex-row space-x-2">
            <span>{awaitedParagraph}</span>
            {citedParagraph && <>
              {/* TODO: use different arrows! */}
              <span><LeftRightArrow /></span>
              <span>{citedParagraph}</span>
            </>}
            <div className="flex-grow" />
            <button type="button" className="text-amber-600" title={t('edit')} onClick={() => setIsEdited(true)}><EditIcon /></button>
            <button type="button" className="text-red-600" title={t('delete')} onClick={deleteParagraphCitationAnnotation}><DeleteIcon /></button>
          </div>

          {explanation !== undefined && <div className="font-bold">{explanation}</div>}
        </div>
      </div>
    );
}

interface IProps extends CommonProps {
  paragraphCitationAnnotations: ParagraphCitationAnnotationFragment[];
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
}

const emptyAnno = { awaitedParagraph: '', correctness: Correctness.Unspecified, citedParagraph: '', explanation: '' };

export function ParagraphCitationAnnotationsView({ paragraphCitationAnnotations, onSubmitParagraphCitationAnnotation, setKeyHandlingEnabled, ...funcs }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [isAdding, setIsAdding] = useState(false);

  const addNewAnno = () => setIsAdding(true);
  const onCancel = () => setIsAdding(false);
  const onSubmit = async (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => {
    // TODO: how to select sampleNodeId?
    const sampleNodeId = paragraphCitationAnnotations[0].sampleNodeId;

    await onSubmitParagraphCitationAnnotation(sampleNodeId, paragraphCitationAnnotationInput);
    setIsAdding(false);
  };

  return (
    <div className="p-2 rounded border border-red-600 space-y-2">
      <div className="font-bold underline">{t('paragraphCitationAnalysis')}:</div>

      {paragraphCitationAnnotations.map((annotation) => <ParagraphCitationAnnotationView key={annotation.awaitedParagraph} {...{ annotation, setKeyHandlingEnabled, ...funcs }} />)}

      {isAdding
        ? <ParagraphCitationAnnotationForm initialValues={emptyAnno}  {...{ setKeyHandlingEnabled, onCancel, onSubmit }} />
        : <button type="button" className="text-blue-500 font-bold" onClick={addNewAnno}><PlusIcon /></button>}
    </div>
  );
}
