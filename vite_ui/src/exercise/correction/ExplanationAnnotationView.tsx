import { ReactElement, useState } from 'react';
import { ExplanationAnnotationFragment } from '../../graphql';
import { DeleteIcon, EditIcon } from '../../icons';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';

interface IProps {
  explanationAnnotation: ExplanationAnnotationFragment;
  onUpdate: (newText: string) => Promise<void>;
}

export function ExplanationAnnotationView({ explanationAnnotation, onUpdate }: IProps): ReactElement {

  const { annotation } = explanationAnnotation;

  const [isEdit, setIsEdit] = useState(false);

  const onEdit = () => setIsEdit(true);
  const onDelete = () => void 0;

  return isEdit
    ? <ExplanationAnnotationForm initialText={annotation} onUpdate={onUpdate} onCancel={() => setIsEdit(false)} />
    : (
      <div className="flex flex-row space-x-2">
        <div className="flex-grow">{annotation}</div>
        <button type="button" className="text-amber-600 font-bold" onClick={onEdit}><EditIcon /></button>
        <button type="button" className="text-red-600 font-bold" onClick={onDelete}><DeleteIcon /></button>
      </div>
    );
}
