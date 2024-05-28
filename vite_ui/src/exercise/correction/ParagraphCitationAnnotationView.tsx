import { ReactElement, useState } from 'react';
import { correctnessTextColor } from '../../model/correctness';
import { ParagraphCitationAnnotationFragment, ParagraphCitationAnnotationInput } from '../../graphql';
import { CorrectnessIcon } from '../CorrectnessIcon';
import { DeleteIcon, EditIcon, LeftRightArrow } from '../../icons';
import { useTranslation } from 'react-i18next';
import { isDefined } from '../../funcs';
import { ParagraphCitationAnnotationForm } from './ParagraphCitationAnnotationForm';

interface ViewProps {
  annotation: ParagraphCitationAnnotationFragment;
  editFuncs?: {
    onEdit: () => Promise<void>;
    onDelete: () => void;
  }
}

function ParagraphCitationAnnotationView({ annotation, editFuncs }: ViewProps): ReactElement {

  const { awaitedParagraph, citedParagraph, correctness, explanation } = annotation;
  const { t } = useTranslation('common');

  return (
    <div className="flex flew-row space-x-2">
      <div className={correctnessTextColor(correctness)}>
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
          {editFuncs && <>
            <button type="button" className="text-amber-600" title={t('edit')} onClick={editFuncs.onEdit}><EditIcon /></button>
            <button type="button" className="text-red-600" title={t('delete')} onClick={editFuncs.onDelete}><DeleteIcon /></button>
          </>}
        </div>
      </div>
    </div>
  );
}

export interface SingleParagraphCitationAnnotationEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdate: (awaitedParagraph: string, newValues: ParagraphCitationAnnotationInput) => Promise<void>;
  getRecommendations: (awaitedParagraph: string) => Promise<string[]>;
  onDelete: (awaitedParagraph: string) => void;
}

interface EditableViewProps {
  annotation: ParagraphCitationAnnotationFragment;
  editFuncs: SingleParagraphCitationAnnotationEditFuncs | undefined;
}

function initEditValues({ awaitedParagraph, correctness, citedParagraph, explanation }: ParagraphCitationAnnotationFragment): ParagraphCitationAnnotationInput {
  return { awaitedParagraph, correctness, citedParagraph: citedParagraph || '', explanation: explanation || '' };
}

export function ParagraphCitationAnnotationEditableView({ annotation, editFuncs }: EditableViewProps): ReactElement {

  const [recommendations, setRecommendations] = useState<string[]>();

  if (!isDefined(editFuncs)) {
    return <ParagraphCitationAnnotationView annotation={annotation} editFuncs={undefined} />;
  }

  const { setKeyHandlingEnabled, getRecommendations, onUpdate, onDelete, } = editFuncs;

  const onSubmit = async (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => {
    await onUpdate(annotation.awaitedParagraph, paragraphCitationAnnotationInput);
    setRecommendations(undefined);
  };

  const singleEditFuncs = {
    onEdit: async () => setRecommendations(await getRecommendations(annotation.awaitedParagraph)),
    onDelete: () => onDelete(annotation.awaitedParagraph)
  };

  return recommendations !== undefined
    ? <ParagraphCitationAnnotationForm initialValues={initEditValues(annotation)} {...{ setKeyHandlingEnabled, recommendations, onSubmit }}
      onCancel={() => setRecommendations(undefined)} />
    : <ParagraphCitationAnnotationView annotation={annotation} editFuncs={singleEditFuncs} />;
}
