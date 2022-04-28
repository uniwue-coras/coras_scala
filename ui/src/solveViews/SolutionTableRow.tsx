import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {ReductionValues, SolutionTableCell, UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './SolutionTableCell';
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
    <>

      <td className="align-text-top">
        {sampleEntry && (userEntry
          ? <SolutionTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch}/>)}
      </td>

      <td className="text-center align-text-top">
        <span className={classNames({'text-green-500': correctness === Correctness.COMPLETE})}>&#9679;</span>
        <span className={classNames({'text-yellow-500': correctness === Correctness.PARTIAL})}>&#9679;</span>
        <span className={classNames({'text-red-500': correctness === Correctness.NONE})}>&#9679;</span>
      </td>

      <td className="align-text-top">
        {userEntry && (sampleEntry
          ? <SolutionTableCell entry={userEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </td>

    </>
  );
}
