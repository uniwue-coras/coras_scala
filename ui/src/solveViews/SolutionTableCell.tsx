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
}

export function SolutionTableCell({entry, level, reductionValues}: IProps): JSX.Element {

  const {index, text, applicability/*, subTexts*/} = entry;
  const {isReducible, isReduced, toggleIsReduced} = reductionValues;

  return (
    <>
      <div style={{marginLeft: `${indentPerRow * level}px`}}>
        <div>
          {isReducible && <span onClick={toggleIsReduced}>{isReduced ? <span>&gt;</span> : <span>&or;</span>}</span>}
          &nbsp;{getBullet(level, index)}. {text} {stringifyApplicability(applicability)}
        </div>

        {/*TODO: when to show subTexts? */ /*subTexts.length > 0 && <div style={{marginLeft: `${indentPerRow}px`}}>
          <ul>{subTexts.map(({text: s}) => <li key={s}>{s}</li>)}</ul>
        </div>*/}
      </div>
    </>
  );
}

interface MyDragObject {
  userPath: number[];
}

interface MyCollectedProps {
  isOver: boolean;
}

export function UnMatchedUserSolutionEntryTableCell({path, ...props}: IProps & { path: number[] }): JSX.Element {

  const [_, dragRef] = useDrag<MyDragObject>({type: 'solutionTableCell', item: {userPath: path}});

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
