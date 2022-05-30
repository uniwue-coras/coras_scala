import {MouseEvent} from 'react';
import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {ReductionValues, SolutionTableCell, UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './SolutionTableCell';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

export enum Correctness {
  COMPLETE, PARTIAL, NONE
}

export interface BaseIProps {
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  clearMatch: (event: MouseEvent<HTMLButtonElement>, path: number[]) => void;
}

interface IProps extends BaseIProps {
  sampleEntry: NumberedAnalyzedSolutionEntry | undefined;
  userEntry: NumberedAnalyzedSolutionEntry | undefined;
  level: number;
  correctness?: Correctness;
  reductionValues: ReductionValues;
  path: number[];
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
  clearMatch,
  isSelected
}: IProps): JSX.Element {

  const {t} = useTranslation('common');

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
        {sampleEntry && userEntry &&
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={(event) => clearMatch(event, path)}>&#10005;</button>}
      </td>

      <td className="align-text-top">
        {userEntry && (sampleEntry
          ? <SolutionTableCell entry={userEntry} level={level} reductionValues={reductionValues} isSelected={isSelected}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </td>

    </>
  );
}
