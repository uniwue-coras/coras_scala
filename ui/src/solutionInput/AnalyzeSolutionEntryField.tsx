import {useState} from 'react';
import {TreeNodeFieldProps} from './SolutionEntryMainField';
import {AnalyzedSolutionEntry} from './solutionEntryNode';
import {getBullet} from './bulletTypes';
import {FieldArray} from 'formik';
import {stringifyApplicability} from '../model/applicability';
import {ParagraphCitationField} from './ParagraphCitationField';
import {ParagraphCitationInput} from '../graphql';
import {HiChevronDown, HiChevronRight} from 'react-icons/hi';

function markParagraphCitationInText(text: string, {startIndex, endIndex}: ParagraphCitationInput): JSX.Element {
  return <span>
    {text.substring(0, startIndex)}
    <span className="has-background-primary">{text.substring(startIndex, endIndex)}</span>
    {text.substring(endIndex)}
  </span>;
}

export function AnalyzeSolutionEntryField({
  entry,
  name,
  index,
  depth,
  reduceValues,
  /*
  moveValues,
  addChild,
  deleteValues
   */
}: TreeNodeFieldProps<AnalyzedSolutionEntry>): JSX.Element {

  const {isReducible, isReduced, toggleIsReduced} = reduceValues;

  const {text, subTexts, applicability/*, weight, priorityPoints, otherNumber*/, paragraphCitations} = entry;

  const [markedParagraphCitationNumber, setMarkedParagraphCitationNumber] = useState<number | undefined>();

  const markedText = markedParagraphCitationNumber || markedParagraphCitationNumber === 0
    ? markParagraphCitationInText(text, paragraphCitations[markedParagraphCitationNumber])
    : text;

  // FIXME: make reducible!

  return (
    <div className="mt-2">
      <p className="flex">
        {isReducible && <span onClick={toggleIsReduced}>{isReduced ? <HiChevronRight/> : <HiChevronDown/>}</span>}
        {getBullet(depth, index)}.&nbsp;{markedText} {stringifyApplicability(applicability)}
      </p>

      {!isReduced && <div className="ml-10">

        {paragraphCitations && <FieldArray name={`${name}.paragraphCitations`}>
          {(/*arrayHelpers*/) => <>
            {paragraphCitations.map((cp, paragraphIndex) =>
              <ParagraphCitationField key={paragraphIndex} name={`${name}.paragraphCitations.${paragraphIndex}`} paragraphCitation={cp}
                                      isMarked={paragraphIndex === markedParagraphCitationNumber}
                                      setMarked={() => setMarkedParagraphCitationNumber((value) => value === paragraphIndex ? undefined : paragraphIndex)}/>)}
          </>}
        </FieldArray>}

        {subTexts && <FieldArray name={`${name}.subTexts`}>
          {(/*arrayHelpers*/) => <>
            {subTexts.map(({text, applicability}, subTextIndex) => <p key={subTextIndex} className="my-3">{text} {stringifyApplicability(applicability)}</p>)}
          </>}
        </FieldArray>}

      </div>}

    </div>
  );
}
