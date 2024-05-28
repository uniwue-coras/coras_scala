import { ReactElement, useState } from 'react';
import { Correctness, ParagraphCitationAnnotationFragment, ParagraphCitationAnnotationInput } from '../../graphql';
import { PlusIcon } from '../../icons';
import { ParagraphCitationAnnotationForm } from './ParagraphCitationAnnotationForm';
import { ParagraphCitationAnnotationEditableView, SingleParagraphCitationAnnotationEditFuncs } from './ParagraphCitationAnnotationView';
import { isDefined } from '../../funcs';
import { CorrectnessSignal } from '../CorrectnessSignal';
import { nextCorrectness } from '../../correctness';

export interface ParagraphCitationAnnotationEditFuncs extends SingleParagraphCitationAnnotationEditFuncs {
  updateCorrectness: (correctness: Correctness) => void;
  onSubmit: (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => Promise<void>;
}

interface IProps {
  correctness: Correctness;
  annotations: ParagraphCitationAnnotationFragment[];
  allEditFuncs: ParagraphCitationAnnotationEditFuncs | undefined;
}

const emptyAnno = { awaitedParagraph: '', correctness: Correctness.Unspecified, citedParagraph: '', explanation: '' };

export function ParagraphCitationAnnotationsView({ correctness, annotations, allEditFuncs }: IProps): ReactElement {

  const [isAdding, setIsAdding] = useState(false);

  let editFuncs: SingleParagraphCitationAnnotationEditFuncs | undefined = undefined;
  let updateCorrectness: (() => void) | undefined = undefined;
  let inner: ReactElement | undefined = undefined;

  if (isDefined(allEditFuncs)) {
    const { setKeyHandlingEnabled, updateCorrectness: onUpdateCorrectness, getRecommendations, onSubmit: onSubmitParagraphCitationAnnotation, ...otherFuncs } = allEditFuncs;

    const onCancel = () => setIsAdding(false);

    updateCorrectness = () => onUpdateCorrectness(nextCorrectness(correctness));

    const onSubmit = async (paragraphCitationAnnotationInput: ParagraphCitationAnnotationInput) => {
      await onSubmitParagraphCitationAnnotation(paragraphCitationAnnotationInput);
      onCancel();
    };

    editFuncs = { setKeyHandlingEnabled, getRecommendations, ...otherFuncs };

    inner = isAdding
      ? <ParagraphCitationAnnotationForm {...{ setKeyHandlingEnabled, onSubmit, onCancel }} initialValues={emptyAnno} recommendations={[]} />
      : <button type="button" className="text-blue-500 font-bold" onClick={() => setIsAdding(true)}><PlusIcon /></button >;
  }

  return (
    <div className="flex flex-row space-x-2 items-start">
      <CorrectnessSignal letter="§" {...{ correctness, updateCorrectness }} />

      <div className="flex-grow p-2 rounded bg-white">
        {annotations.map((annotation) =>
          <ParagraphCitationAnnotationEditableView key={annotation.awaitedParagraph} annotation={annotation} editFuncs={editFuncs} />)}

        {inner}
      </div>
    </div>
  );
}
