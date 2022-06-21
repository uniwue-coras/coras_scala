import {getBullet} from '../solutionInput/bulletTypes';
import {stringifyApplicability} from '../model/applicability';
import {ReduceElement} from '../ReduceElement';
import {SolutionEntryComment} from '../model/correction/corrector';
import {useTranslation} from 'react-i18next';
import {Fragment} from 'react';
import {ISolutionNode} from '../myTsModels';

const indentPerRow = 40;

export interface ReductionValues {
  isReducible: boolean;
  isReduced: boolean;
  toggleIsReduced: () => void;
}

export interface SolutionTableCellProps {
  entry: ISolutionNode;
  level: number;
  reductionValues: ReductionValues;
  markedText?: { startIndex: number, endIndex: number };
}

export function SolutionTableCell({entry, level, reductionValues, markedText}: SolutionTableCellProps): JSX.Element {

  const {childIndex, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  const displayText = markedText
    ? <Fragment>
      {text.substring(0, markedText.startIndex)}
      <span className="bg-amber-500">{text.substring(markedText.startIndex, markedText.endIndex)}</span>
      <span>{text.substring(markedText.endIndex)}</span>
    </Fragment>
    : <span>{text}</span>;

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <div className="font-bold">
        {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, childIndex)}.&nbsp;{displayText} {stringifyApplicability(applicability)}
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>
    </div>
  );
}

interface AnnotationTableCellIProps extends SolutionTableCellProps {
  selection: SolutionEntryComment;
}

export function AnnotationTableCell({entry, level, reductionValues, selection}: AnnotationTableCellIProps): JSX.Element {
  const {childIndex, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;
  const {startIndex, endIndex} = selection;

  const {t} = useTranslation('common');

  const [prior, selected, posterior] = [
    text.substring(0, startIndex),
    text.substring(startIndex, endIndex - 1),
    text.substring(endIndex)
  ];

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <div className="font-bold">
        {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, childIndex)}.&nbsp;{prior}<span className="bg-blue-200">{selected}</span>{posterior}
        {stringifyApplicability(applicability)}
        <button type="button" className="" title={t('submitSelection')} onClick={() => void 0}>&nbsp;&#10004;</button>
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>
    </div>
  );
}
