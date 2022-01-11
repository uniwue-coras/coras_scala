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
    <div className="columns">

      <div className="column">
        {sampleEntry && (userEntry
          ? <SolutionTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch}/>)}
      </div>

      <div className="column is-1 has-text-centered">
        <HiPlusCircle className={classNames({'has-text-success': correctness === Correctness.COMPLETE})}/>
        <HiDotsCircleHorizontal className={classNames({'has-text-warning': correctness === Correctness.PARTIAL})}/>
        <HiMinusCircle className={classNames({'has-text-danger': correctness === Correctness.NONE})}/>
      </div>

      <div className="column">
        {userEntry && (sampleEntry
          ? <SolutionTableCell entry={userEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </div>

    </div>
  );
}
