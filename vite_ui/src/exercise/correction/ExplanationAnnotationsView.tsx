import { ReactElement, useState } from 'react';
import { Correctness, ExplanationAnnotationFragment } from '../../graphql';
import { ExplanationAnnotationForm } from './ExplanationAnnotationForm';
import { PlusIcon } from '../../icons';
import { isDefined } from '../../funcs';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { nextCorrectness } from '../../correctness';
import { ExplanationAnnotationEditableView, SingleExplanationAnnotationEditFuncs } from './ExplanationAnnotationView';

export interface ExplanationAnnotationEditFunctions extends SingleExplanationAnnotationEditFuncs {
  updateCorrectness: (correctness: Correctness) => void;
  getRecommendations: () => Promise<string[]>;
  onSubmit: (text: string) => Promise<void>;
}

interface ContainerProps {
  correctness: Correctness;
  annotations: ExplanationAnnotationFragment[];
  allEditFuncs?: ExplanationAnnotationEditFunctions | undefined;
}

export function ExplanationAnnotationsEditView({ correctness, annotations, allEditFuncs }: ContainerProps): ReactElement {

  const [recommendations, setRecommendations] = useState<string[]>();

  let updateExplanationCorrectness: (() => void) | undefined = undefined;
  let singleEditFuncs: SingleExplanationAnnotationEditFuncs | undefined = undefined;
  let inner: ReactElement | undefined = undefined;

  if (isDefined(allEditFuncs)) {
    const { updateCorrectness, getRecommendations, onSubmit, setKeyHandlingEnabled, onUpdate, onDelete } = allEditFuncs;

    updateExplanationCorrectness = () => updateCorrectness(nextCorrectness(correctness));
    singleEditFuncs = { setKeyHandlingEnabled, onUpdate, onDelete };
    inner = isDefined(recommendations)
      ? <ExplanationAnnotationForm initialText={''} {...{ recommendations, setKeyHandlingEnabled }} onUpdate={onSubmit} onCancel={() => setRecommendations(undefined)} />
      : <button type="button" className="text-blue-500 font-bold" onClick={async () => setRecommendations(await getRecommendations())}><PlusIcon /></button>;
  }

  return (
    <div className="flex flex-row space-x-2 items-start">
      <CorrectnessSignal letter="E" correctness={correctness} updateCorrectness={updateExplanationCorrectness} />

      <div className="flex-grow p-2 rounded bg-white">
        {annotations.map((annotation) =>
          <ExplanationAnnotationEditableView key={annotation.text} {...{ annotation, singleEditFuncs }} />)}

        {inner}
      </div>
    </div>
  );
}
