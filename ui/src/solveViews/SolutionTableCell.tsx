import {getBullet} from '../solutionInput/bulletTypes';
import {stringifyApplicability} from '../model/applicability';
import {ReduceElement} from '../ReduceElement';
import {ISolutionNode} from '../myTsModels';

const indentPerRow = 40;

export interface MarkingIndexes {
  startIndex: number;
  endIndex: number;
}

export interface ReductionValues {
  isReducible: boolean;
  isReduced: boolean;
  toggleIsReduced: () => void;
}

export interface SolutionTableCellProps {
  entry: ISolutionNode;
  level: number;
  reductionValues: ReductionValues;
  markedText?: MarkingIndexes;
  hideSubTexts: boolean;
}

const markedTextClass = 'bg-amber-500';

function getTextMarks(text: string, {startIndex, endIndex}: MarkingIndexes): JSX.Element {
  return (
    <>
      {text.substring(0, startIndex)}
      <span className={markedTextClass}>{text.substring(startIndex, endIndex - 1)}</span>
      {text.substring(endIndex)}
    </>
  );
}

export function SolutionTableCell({entry, level, reductionValues, markedText, hideSubTexts}: SolutionTableCellProps): JSX.Element {
  const {childIndex, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  const displayText = markedText
    ? getTextMarks(text, markedText)
    : <span>{text}</span>;

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <div className="font-bold">
        {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, childIndex)}.&nbsp;{displayText} {stringifyApplicability(applicability)}
      </div>

      {!hideSubTexts && <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>}
    </div>
  );
}
