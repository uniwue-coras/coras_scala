import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useDrag, useDrop} from 'react-dnd';
import {getBullet} from '../solutionInput/bulletTypes';
import classNames from 'classnames';
import {useState} from 'react';
import {stringifyApplicability} from '../model/applicability';
import {ReduceElement} from '../ReduceElement';
import {useTranslation} from 'react-i18next';

const indentPerRow = 20;

export interface ReductionValues {
  isReducible: boolean;
  isReduced: boolean;
  toggleIsReduced: () => void;
}

interface IProps {
  entry: NumberedAnalyzedSolutionEntry;
  level: number;
  reductionValues: ReductionValues;
}

export function SolutionTableCell({entry, level, reductionValues}: IProps): JSX.Element {

  const {index, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  return (
    <div style={{marginLeft: `${indentPerRow * level}px`}}>
      <span className="font-bold">
      {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
        &nbsp;{getBullet(level, index)}.&nbsp;{text} {stringifyApplicability(applicability)}
        </span>

      <div style={{marginLeft: `${indentPerRow}px`}}>
        {subTexts.map((s, i) => <p key={i}>{s.text}</p>)}
      </div>
    </div>
  );
}

interface AnnotationTableCellIProps extends IProps {
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
  const {index, text, applicability/*, subTexts*/} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  const textParts = text;

  const [selectedTextPartIndexes, setSelectedTextPartIndexes] = useState<undefined | AnnotationSelection>(undefined);
  const {t} = useTranslation('common');

  const selectedTextParts = getSelectedTextPartsFromIndexes(textParts.split(/\s+/), selectedTextPartIndexes);

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
      {isReducible && <ReduceElement isReduced={isReduced} toggleIsReduced={toggleIsReduced}/>}
      &nbsp;{getBullet(level, index)}.&nbsp;
      {Array.isArray(selectedTextParts)
        ? selectedTextParts.map((textPart, index) =>
          <span key={index} onClick={() => updateSelection(index)} className={index === selectedTextPartIndexes?.start ? 'bg-blue-300' : ''}>{textPart} </span>
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
  );
}

interface MyDragObject {
  userPath: number[];
}

interface MyCollectedProps {
  isOver: boolean;
}

export function UnMatchedUserSolutionEntryTableCell({path, ...props}: IProps & { path: number[] }): JSX.Element {

  const dragRef = useDrag<MyDragObject>({type: 'solutionTableCell', item: {userPath: path}})[1];

  return (
    <div ref={dragRef}>
      <SolutionTableCell {...props}/>
    </div>
  );
}

export function UnMatchedSampleSolutionEntryTableCell(
  {path, createNewMatch, ...props}: IProps & { path: number[], createNewMatch: (samplePath: number[], userPath: number[]) => void }
): JSX.Element {

  const [{isOver}, dropRef] = useDrop<MyDragObject, unknown, MyCollectedProps>({
    accept: 'solutionTableCell',
    drop: ({userPath}) => {
      createNewMatch(path, userPath);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div ref={dropRef} className={classNames({'bg-slate-200': isOver})}>
      <SolutionTableCell {...props}/>
    </div>
  );
}
