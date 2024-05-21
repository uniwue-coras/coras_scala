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
  sampleNodeId: number;
  userNodeId: number;
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onGetParagraphCitationAnnotationRecommendations: (key: ParCitAnnoKey) => Promise<string[]>;
  onUpdateParagraphCitationAnnotation: (key: ParCitAnnoKey, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
  onDeleteParagraphCitationAnnotation: (key: ParCitAnnoKey) => void;
}

interface SubIProps extends CommonProps {
  annotation: ParagraphCitationAnnotationFragment;
}

function initEditValues({ awaitedParagraph, correctness, citedParagraph, explanation }: ParagraphCitationAnnotationFragment): ParagraphCitationAnnotationInput {
  return { awaitedParagraph, correctness, citedParagraph: citedParagraph || '', explanation: explanation || '' };
}

function ParagraphCitationAnnotationView({
  sampleNodeId,
  userNodeId,
  annotation,
  setKeyHandlingEnabled,
  onGetParagraphCitationAnnotationRecommendations,
  onUpdateParagraphCitationAnnotation,
  onDeleteParagraphCitationAnnotation,
}: SubIProps): ReactElement {

  const { awaitedParagraph, correctness, citedParagraph, explanation } = annotation;
  const key = { sampleNodeId, userNodeId, awaitedParagraph };

  const { t } = useTranslation('common');
  const [recommendations, setRecommendations] = useState<string[]>();

  async function updateEditedAnnotation(paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) {
    try {
      await onUpdateParagraphCitationAnnotation(key, paragraphCitationAnnotationInput);
      setRecommendations(undefined);
    } catch (error) {
      console.error(error);
    }
  }

  const goToEditMode = async () => {
    const recommendations = await onGetParagraphCitationAnnotationRecommendations({ sampleNodeId, userNodeId, awaitedParagraph });
    setRecommendations(recommendations);
  };

  const deleteParagraphCitationAnnotation = () => confirm(t('reallyDeleteParagraphCitationAnnotation?')) && onDeleteParagraphCitationAnnotation(key);

  return recommendations !== undefined
    ? <ParagraphCitationAnnotationForm initialValues={initEditValues(annotation)} {...{ setKeyHandlingEnabled, recommendations }} onSubmit={updateEditedAnnotation} onCancel={() => setRecommendations(undefined)} />
    : (
      <div className="flex flew-row space-x-2">
        <div className={classNames(correctnessTextColor(correctness))}>
          <CorrectnessIcon correctness={correctness} />
        </div>

        <div className="flex-grow">
          <div className="flex flex-row space-x-2">
            <div>{awaitedParagraph}</div>
            {citedParagraph && <>
              <span><LeftRightArrow /></span>
              <span>{citedParagraph}</span>
            </>}
            <div className="flex-grow font-bold">{explanation}</div>
            <button type="button" className="text-amber-600" title={t('edit')} onClick={goToEditMode}><EditIcon /></button>
            <button type="button" className="text-red-600" title={t('delete')} onClick={deleteParagraphCitationAnnotation}><DeleteIcon /></button>
          </div>
        </div>
      </div>
    );
}

interface IProps extends CommonProps {
  paragraphCitationAnnotations: ParagraphCitationAnnotationFragment[];
  onSubmitParagraphCitationAnnotation: (sampleNodeId: number, userNodeId: number, paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
}

const emptyAnno = { awaitedParagraph: '', correctness: Correctness.Unspecified, citedParagraph: '', explanation: '' };

export function ParagraphCitationAnnotationsView({
  sampleNodeId,
  userNodeId,
  paragraphCitationAnnotations,
  onSubmitParagraphCitationAnnotation,
  setKeyHandlingEnabled,
  ...funcs
}: IProps): ReactElement {

  const [isAdding, setIsAdding] = useState(false);

  const addNewAnno = () => setIsAdding(true);
  const onCancel = () => setIsAdding(false);
  const onSubmit = async (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => {
    await onSubmitParagraphCitationAnnotation(sampleNodeId, userNodeId, paragraphCitationAnnotationInput);
    setIsAdding(false);
  };

  return (
    <div>
      {paragraphCitationAnnotations.length > 0 && paragraphCitationAnnotations.map((annotation) =>
        <ParagraphCitationAnnotationView key={annotation.awaitedParagraph} {...{ sampleNodeId, userNodeId, annotation, setKeyHandlingEnabled, ...funcs }} />
      )}

      {isAdding
        ? <ParagraphCitationAnnotationForm initialValues={emptyAnno} recommendations={[]} {...{ setKeyHandlingEnabled, onCancel, onSubmit }} />
        : <button type="button" className="text-blue-500 font-bold" onClick={addNewAnno}><PlusIcon /></button >}
    </div>
  );
}
