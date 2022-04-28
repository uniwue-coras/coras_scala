import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {useDrag, useDrop} from 'react-dnd';
import {getBullet} from '../solutionInput/bulletTypes';
import classNames from 'classnames';
import {MouseEventHandler} from 'react';
import {stringifyApplicability} from '../model/applicability';

const indentPerRow = 40;

export interface ReductionValues {
  isReducible: boolean;
  isReduced: boolean;
  toggleIsReduced: MouseEventHandler<HTMLSpanElement>;
}

interface IProps {
  entry: NumberedAnalyzedSolutionEntry;
  level: number;
  reductionValues: ReductionValues;
  isSelected?: boolean;
}

export function SolutionTableCell({entry, level, reductionValues, isSelected}: IProps): JSX.Element {

  const {index, text, applicability, subTexts} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  return (
    <>
      <div style={{marginLeft: `${indentPerRow * level}px`}}>
        <div>
          {isReducible && <span onClick={toggleIsReduced}>{isReduced ? <span>&gt;</span> : <span>&or;</span>}</span>}
          &nbsp;{getBullet(level, index)}. {text} {stringifyApplicability(applicability)}
        </div>

        {subTexts.length > 0 && <div style={{marginLeft: `${indentPerRow}px`}}>
          <ul>{subTexts.map(({text: s}) => <li key={s}>{s}</li>)}</ul>
        </div>}
      </div>
    </>
  );
}

export function UnMatchedUserSolutionEntryTableCell({path, ...props}: IProps & { path: number[] }): JSX.Element {

  const dragRef = useDrag({type: 'solutionTableCell', item: {path}})[1];

  return (
    <div ref={dragRef}>
      <SolutionTableCell {...props}/>
    </div>
  );
}

export function UnMatchedSampleSolutionEntryTableCell(
  {path, createNewMatch, ...props}: IProps & { path: number[], createNewMatch: (samplePath: number[], userPath: number[]) => void }
): JSX.Element {

  const [{isOver}, dropRef] = useDrop<{ path: number[] }, unknown, { isOver: boolean }>({
    accept: 'solutionTableCell',
    drop: (item) => {
      createNewMatch(item.path, path);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div ref={dropRef} className={classNames({'has-background-light': isOver})}>
      <SolutionTableCell {...props}/>
    </div>
  );
}
