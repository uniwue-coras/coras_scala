import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {ReductionValues, SolutionTableCell, UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './SolutionTableCell';
import {HiDotsCircleHorizontal, HiMinusCircle, HiPlusCircle} from 'react-icons/hi';
import classNames from 'classnames';

export enum Correctness {
  COMPLETE, PARTIAL, NONE
}

interface IProps {
  sampleEntry: NumberedAnalyzedSolutionEntry | undefined;
  userEntry: NumberedAnalyzedSolutionEntry | undefined;
  level: number;
  correctness?: Correctness;
  reductionValues: ReductionValues;
  path: number[];
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  isSelected?: boolean;
}

export function SolutionTableRow({
  sampleEntry,
  userEntry,
  level,
  correctness = Correctness.NONE,
  reductionValues,
  path,
  createNewMatch,
  isSelected
}: IProps): JSX.Element {

  return (
    <div className="grid grid-cols-12 gap-2">

      <div className="col-span-5">
        {sampleEntry && (userEntry
          ? <SolutionTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch}/>)}
      </div>

      <div className="flex">
        <HiPlusCircle className={classNames({'text-green-500': correctness === Correctness.COMPLETE})}/>
        <HiDotsCircleHorizontal className={classNames({'text-yellow-500': correctness === Correctness.PARTIAL})}/>
        <HiMinusCircle className={classNames({'text-red-500': correctness === Correctness.NONE})}/>
      </div>

      <div className="col-span-5">
        {userEntry && (sampleEntry
          ? <SolutionTableCell entry={userEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </div>

    </div>
  );
}
