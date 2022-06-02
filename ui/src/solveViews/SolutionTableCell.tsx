import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {getBullet} from '../solutionInput/bulletTypes';
import {useState} from 'react';
import {stringifyApplicability} from '../model/applicability';
import {ReduceElement} from '../ReduceElement';
import {useTranslation} from 'react-i18next';

const indentPerRow = 40;

export interface ReductionValues {
  isReducible: boolean;
  isReduced: boolean;
  toggleIsReduced: () => void;
}

export interface SolutionTableCellProps {
  entry: NumberedAnalyzedSolutionEntry;
  level: number;
  reductionValues: ReductionValues;
}

export function SolutionTableCell({entry, level, reductionValues}:  SolutionTableCellProps): JSX.Element {

  const {index, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <div className="font-bold">
        {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, index)}.&nbsp;{text} {stringifyApplicability(applicability)}
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>
    </div>
  );
}

interface AnnotationTableCellIProps extends  SolutionTableCellProps {
  onSelection: (s: AnnotationSelection) => void;
}

interface SelectedTexts {
  prior: string[];
  selected: string[];
  posterior: string[];
}

function getSelectedTextPartsFromIndexes(textParts: string[], selectedTextPartIndexes: AnnotationSelection | undefined): string[] | SelectedTexts {
  if (selectedTextPartIndexes === undefined) {
    return textParts;
  } else {
    const {start, end: maybeEnd} = selectedTextPartIndexes;

    const end = maybeEnd || start;

    return {
      prior: textParts.slice(0, Math.max(start - 1, 0)),
      selected: textParts.slice(start, end + 1),
      posterior: textParts.slice(end + 1)
    };
  }
}

export interface AnnotationSelection {
  start: number;
  end?: number;
}

export function AnnotationTableCell({entry, level, reductionValues, onSelection}: AnnotationTableCellIProps): JSX.Element {
  const {index, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  const [selectedTextPartIndexes, setSelectedTextPartIndexes] = useState<undefined | AnnotationSelection>(undefined);
  const {t} = useTranslation('common');

  const selectedTextParts = getSelectedTextPartsFromIndexes(text.split(/\s+/), selectedTextPartIndexes);

  function updateSelection(index: number): void {
    setSelectedTextPartIndexes((selectedTextPartIndexes) => {
      if (selectedTextPartIndexes === undefined) {
        return {start: index};
      } else {
        const {start, end} = selectedTextPartIndexes;

        if (end === undefined) {
          return index < start
            ? {start: index, end: start}
            : {start, end: index};
        } else {
          return undefined;
        }
      }
    });
  }

  function onSubmitSelection(): void {
    selectedTextPartIndexes && onSelection(selectedTextPartIndexes);
  }

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <div className="font-bold">
        {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, index)}.&nbsp;
        {Array.isArray(selectedTextParts)
          ? selectedTextParts.map((textPart, index) =>
            <span key={index} onClick={() => updateSelection(index)}
                  className={index === selectedTextPartIndexes?.start ? 'bg-blue-300' : ''}>{textPart} </span>
          )
          : <>
            {selectedTextParts.prior.map((textPart, index) => <span key={index} onClick={() => updateSelection(index)}>{textPart} </span>)}
            <span className="bg-blue-300">
          {selectedTextParts.selected.map((textPart, index) => <span key={index}
                                                                     onClick={() => updateSelection(index + selectedTextParts.prior.length)}>{textPart} </span>)}
          </span>
            {selectedTextParts.posterior.map((textPart, index) =>
              <span key={index} onClick={() => updateSelection(index + selectedTextParts.prior.length + selectedTextParts.selected.length)}>{textPart} </span>)}
          </>}
        {stringifyApplicability(applicability)}
        <button type="button" className="" title={t('submitSelection')} onClick={onSubmitSelection}>&nbsp;&#10004;</button>
      </div>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>
    </div>
  );
}
