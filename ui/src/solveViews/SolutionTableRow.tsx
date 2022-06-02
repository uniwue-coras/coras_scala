import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {AnnotationSelection, AnnotationTableCell, ReductionValues, SolutionTableCell,} from './SolutionTableCell';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {AnnotationSubmitForm} from './AnnotationSubmitForm';
import {UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './UnMatchedSolutionTableCell';
import {SolutionEntryComment} from '../model/correction/corrector';

export enum Correctness {
  COMPLETE, PARTIAL, NONE
}

export interface BaseIProps {
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  clearMatch: (path: number[]) => void;
}

interface IProps extends BaseIProps {
  sampleSolutionEntry: NumberedAnalyzedSolutionEntry | undefined;
  userSolutionEntry: NumberedAnalyzedSolutionEntry | undefined;
  comments: SolutionEntryComment[],
  addComment: (comment: SolutionEntryComment) => void;
  level: number;
  correctness?: Correctness;
  reductionValues: ReductionValues;
  path: number[];
}

type AnnotationMode = undefined | 'RangeSelection' | AnnotationSelection;

export function SolutionTableRow({
  sampleSolutionEntry,
  userSolutionEntry,
  comments,
  addComment,
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

  function onAddComment(comment: string): void {
    addComment({startIndex: 0, endIndex: 0, comment});
    cancelAnnotationMode();
  }

  return (
    <tr>

      <td className="p-2 align-text-top">
        {sampleSolutionEntry && (userSolutionEntry
          ? <SolutionTableCell entry={sampleSolutionEntry} level={level} reductionValues={reductionValues}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleSolutionEntry} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch}/>)}
      </td>

      <td className="p-2 align-text-top">
        <span className={classNames({'text-green-500': correctness === Correctness.COMPLETE})}>&#9679;</span>
        <span className={classNames({'text-yellow-500': correctness === Correctness.PARTIAL})}>&#9679;</span>
        <span className={classNames({'text-red-500': correctness === Correctness.NONE})}>&#9679;</span>
        {sampleSolutionEntry && userSolutionEntry && <>
          <button type="button" className={classNames('ml-2', 'font-bold', isAnnotationMode ? 'text-red-500' : 'text-blue-500')} title={t('addAnnotation')}
                  onClick={startAnnotationMode}>
            &#x270E;
          </button>
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={() => clearMatch(path)}>&#10005;</button>
        </>}
      </td>

      <td className="p-2 align-text-top">
        {userSolutionEntry && (sampleSolutionEntry
          ? (isAnnotationMode
            ? <AnnotationTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues}
                                   onSelection={onAnnotationModeRangeSelected}/>
            : <SolutionTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues}/>)
          : <UnMatchedUserSolutionEntryTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </td>

      <td className="p-2 align-text-top">
        {comments.map(({comment}, index) => <p key={index}>{comment}</p>)}

        {isAnnotationMode && (isAnnotationMode !== 'RangeSelection'
          ? <AnnotationSubmitForm onSubmit={onAddComment}/>
          : <></>)}
      </td>

    </tr>
  );
}
