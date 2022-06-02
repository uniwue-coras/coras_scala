import {useDrag, useDrop} from 'react-dnd';
import classNames from 'classnames';
import {SolutionTableCell, SolutionTableCellProps} from './SolutionTableCell';

interface MyDragObject {
  userPath: number[];
}

interface MyCollectedProps {
  isOver: boolean;
}

interface UnMatchedSolutionEntryCellProps extends SolutionTableCellProps {
  path: number[];
}

export function UnMatchedUserSolutionEntryTableCell({path, ...props}: UnMatchedSolutionEntryCellProps): JSX.Element {

  const dragRef = useDrag<MyDragObject>({type: 'solutionTableCell', item: {userPath: path}})[1];

  return (
    <div ref={dragRef}>
      <SolutionTableCell {...props}/>
    </div>
  );
}

interface UnMatchedSampleSolutionEntryTableCellProps extends UnMatchedSolutionEntryCellProps {
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
}

export function UnMatchedSampleSolutionEntryTableCell({path, createNewMatch, ...props}: UnMatchedSampleSolutionEntryTableCellProps): JSX.Element {

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
