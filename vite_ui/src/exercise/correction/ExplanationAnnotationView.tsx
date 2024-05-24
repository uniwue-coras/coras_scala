import { ReactElement, useState } from 'react';
import { ExplanationAnnotationFragment } from '../../graphql';
import { DeleteIcon, EditIcon, PlusIcon } from '../../icons';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';

interface CommonProps {
  setKeyHandlingEnabled: (enabled: boolean) => void;
  onUpdate: (oldText: string, newText: string) => Promise<void>;
  onDelete: (text: string) => void;

}

interface IProps extends CommonProps {
  explanationAnnotation: ExplanationAnnotationFragment;
}

export function ExplanationAnnotationView({ explanationAnnotation, setKeyHandlingEnabled, onUpdate, onDelete }: IProps): ReactElement {

  const { annotation } = explanationAnnotation;

  const [isEdit, setIsEdit] = useState(false);
  const onEdit = () => setIsEdit(true);

  return isEdit
    ? <ExplanationAnnotationForm initialText={annotation} recommendations={[]} {...{ setKeyHandlingEnabled }} onUpdate={(newText) => onUpdate(annotation, newText)} onCancel={() => setIsEdit(false)} />
    : (
      <div className="flex flex-row space-x-2">
        <div className="flex-grow">{annotation}</div>
        <button type="button" className="text-amber-600 font-bold" onClick={onEdit}><EditIcon /></button>
        <button type="button" className="text-red-600 font-bold" onClick={() => onDelete(annotation)}><DeleteIcon /></button>
      </div>
    );
}

interface AllProps extends CommonProps {
  explanationAnnotations: ExplanationAnnotationFragment[];
  sampleNodeId: number;
  userNodeId: number;
  onGetExplanationAnnotationRecommendations: (sampleNodeId: number, userNodeI: number) => Promise<string[]>;
  onSubmitExplanationAnnotation: (sampleNodeId: number, userNodeId: number, text: string) => Promise<void>;
}


export function ExplanationAnnotationsView({
  explanationAnnotations,
  sampleNodeId,
  userNodeId,
  onGetExplanationAnnotationRecommendations,
  onSubmitExplanationAnnotation,
  setKeyHandlingEnabled,
  ...funcs
}: AllProps): ReactElement {

  const [recommendations, setRecommendations] = useState<string[]>();
  const onCreateExplanationAnnotation = async () => {
    const recommendations = await onGetExplanationAnnotationRecommendations(sampleNodeId, userNodeId);
    setRecommendations(recommendations);
  };

  const submitExplanationAnnotation = async (newText: string) => onSubmitExplanationAnnotation(sampleNodeId, userNodeId, newText);



  return (
    <div>
      {explanationAnnotations.map((explanationAnnotation) =>
        <ExplanationAnnotationView key={explanationAnnotation.annotation} {...{ explanationAnnotation, setKeyHandlingEnabled }} {...funcs} />)}

      {recommendations
        ? <ExplanationAnnotationForm initialText={''} recommendations={recommendations} setKeyHandlingEnabled={setKeyHandlingEnabled} onUpdate={submitExplanationAnnotation} onCancel={() => setRecommendations(undefined)} />
        : <button type="button" className="text-blue-500 font-bold" onClick={onCreateExplanationAnnotation}><PlusIcon /></button>}
    </div>
  );
}
