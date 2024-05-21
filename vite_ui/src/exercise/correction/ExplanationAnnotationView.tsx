import { ReactElement, useState } from 'react';
import { ExplanationAnnotationFragment } from '../../graphql';
import { DeleteIcon, EditIcon } from '../../icons';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';

interface IProps {
  explanationAnnotation: ExplanationAnnotationFragment;
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdate: (newText: string) => Promise<void>;
  onDelete: () => void;
}

export function ExplanationAnnotationView({ explanationAnnotation, setKeyHandlingEnabled, onUpdate, onDelete }: IProps): ReactElement {

  const { annotation } = explanationAnnotation;

  const [isEdit, setIsEdit] = useState(false);
  const onEdit = () => setIsEdit(true);

  return isEdit
    ? <ExplanationAnnotationForm initialText={annotation} recommendations={[]} {...{ onUpdate, setKeyHandlingEnabled }} onCancel={() => setIsEdit(false)} />
    : (
      <div className="flex flex-row space-x-2">
        <div className="flex-grow">{annotation}</div>
        <button type="button" className="text-amber-600 font-bold" onClick={onEdit}><EditIcon /></button>
        <button type="button" className="text-red-600 font-bold" onClick={onDelete}><DeleteIcon /></button>
      </div>
    );
}
