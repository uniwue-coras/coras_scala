import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {
  AnnotationSelection,
  AnnotationTableCell,
  ReductionValues,
  SolutionTableCell,
  UnMatchedSampleSolutionEntryTableCell,
  UnMatchedUserSolutionEntryTableCell
} from './SolutionTableCell';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {AnnotationSubmitForm} from './AnnotationSubmitForm';

export enum Correctness {
  COMPLETE, PARTIAL, NONE
}

export interface BaseIProps {
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  clearMatch: (path: number[]) => void;
}

interface IProps extends BaseIProps {
  sampleEntry: NumberedAnalyzedSolutionEntry | undefined;
  userEntry: NumberedAnalyzedSolutionEntry | undefined;
  level: number;
  correctness?: Correctness;
  reductionValues: ReductionValues;
  path: number[];
}

type AnnotationMode = undefined | 'RangeSelection' | AnnotationSelection;

export function SolutionTableRow({
  sampleEntry,
  userEntry,
  level,
  correctness = Correctness.NONE,
  reductionValues,
  path,
  createNewMatch,
  clearMatch
}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const [isAnnotationMode, setIsAnnotationMode] = useState<AnnotationMode>();

  function startAnnotationMode(): void {
    setIsAnnotationMode(() => 'RangeSelection');
    // console.info('TODO: add annotation to ' + path.join('.'));
  }

  function onAnnotationModeRangeSelected(annotationSelection: AnnotationSelection): void {
    setIsAnnotationMode(annotationSelection);
  }

  function cancelAnnotationMode(): void {
    setIsAnnotationMode(undefined);
  }

  return (
    <tr>

      <td className="p-2">
        {sampleEntry && (userEntry
          ? <SolutionTableCell entry={sampleEntry} level={level} reductionValues={reductionValues}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleEntry} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch}/>)}
      </td>

      <td className="p-2">
        <span className={classNames({'text-green-500': correctness === Correctness.COMPLETE})}>&#9679;</span>
        <span className={classNames({'text-yellow-500': correctness === Correctness.PARTIAL})}>&#9679;</span>
        <span className={classNames({'text-red-500': correctness === Correctness.NONE})}>&#9679;</span>
        {sampleEntry && userEntry && <>
          <button type="button" className={classNames('ml-2', 'font-bold', isAnnotationMode ? 'text-red-500' : 'text-blue-500')} title={t('addAnnotation')}
                  onClick={startAnnotationMode}>
            &#x270E;
          </button>
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={() => clearMatch(path)}>&#10005;</button>
        </>}
      </td>

      <td className="p-2">
        {userEntry && (sampleEntry
          ? (isAnnotationMode
            ? <AnnotationTableCell entry={userEntry} level={level} reductionValues={reductionValues}
                                   onSelection={onAnnotationModeRangeSelected}/>
            : <SolutionTableCell entry={userEntry} level={level} reductionValues={reductionValues}/>)
          : <UnMatchedUserSolutionEntryTableCell entry={userEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </td>

      <td className="p-2">
        {isAnnotationMode && (isAnnotationMode !== 'RangeSelection'
          ? <AnnotationSubmitForm onSubmit={(value) => console.info(value)}/>
          : <></>)}
      </td>

    </tr>
  );
}
