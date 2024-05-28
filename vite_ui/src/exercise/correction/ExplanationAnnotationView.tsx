import { ReactElement, useState } from 'react';
import { ExplanationAnnotationFragment } from '../../graphql';
import { DeleteIcon, EditIcon } from '../../icons';
import { isDefined } from '../../funcs';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';
import { useTranslation } from 'react-i18next';

interface ViewProps {
  annotation: ExplanationAnnotationFragment;
  editFuncs?: {
    onEdit: () => void;
    onDelete: (text: string) => void;
  }
}

function ExplanationAnnotationView({ annotation: { text }, editFuncs }: ViewProps): ReactElement {

  const { t } = useTranslation('common');

  return (
    <div className="flex flex-row space-x-2">
      <div className="flex-grow">{text}</div>
      {editFuncs && <>
        <button type="button" className="text-amber-600 font-bold" onClick={() => editFuncs.onEdit()} title={t('edit')}><EditIcon /></button>
        <button type="button" className="text-red-600 font-bold" onClick={() => editFuncs.onDelete(text)} title={t('delete')}><DeleteIcon /></button>
      </>}
    </div >
  );
}

export interface SingleExplanationAnnotationEditFuncs {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdate: (oldText: string, newText: string) => Promise<void>;
  onDelete: (text: string) => void;
}

interface EditableViewProps {
  annotation: ExplanationAnnotationFragment;
  singleEditFuncs: SingleExplanationAnnotationEditFuncs | undefined;
}

export function ExplanationAnnotationEditableView({ annotation: annotation, singleEditFuncs }: EditableViewProps): ReactElement {

  const [isEdit, setIsEdit] = useState(false);
  const onEdit = () => setIsEdit(true);

  if (!isDefined(singleEditFuncs)) {
    return <ExplanationAnnotationView {...{ annotation, editFuncs: undefined }} />;
  } else {
    const { setKeyHandlingEnabled, onUpdate, onDelete } = singleEditFuncs;

    return isEdit
      ? <ExplanationAnnotationForm initialText={annotation.text} recommendations={[]} setKeyHandlingEnabled={setKeyHandlingEnabled}
        onUpdate={(newText) => onUpdate(annotation.text, newText)} onCancel={() => setIsEdit(false)} />
      : <ExplanationAnnotationView {...{ annotation, editFuncs: { onEdit, onDelete } }} />;
  }
}
