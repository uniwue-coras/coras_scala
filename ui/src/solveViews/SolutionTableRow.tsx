import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';
import {AnnotationTableCell, ReductionValues, SolutionTableCell,} from './SolutionTableCell';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {AnnotationSubmitForm} from './AnnotationSubmitForm';
import {UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './UnMatchedSolutionTableCell';
import {SolutionEntryComment} from '../model/correction/corrector';
import update from 'immutability-helper';
import {CorrectnessLights} from './CorrectnessLights';

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

  const [annotationMode, setAnnotationMode] = useState<undefined | SolutionEntryComment>();
  const [hoveredComment, setHoveredComment] = useState<number>();

  function startAnnotationMode(): void {
    setAnnotationMode({startIndex: 0, endIndex: userSolutionEntry?.text.length || 0, comment: ''});
  }

  function onAnnotationStartUpdate(startIndex: number): void {
    annotationMode && setAnnotationMode((annotation) => update(annotation, {startIndex: {$set: startIndex}}));
  }

  function onAnnotationEndUpdate(endIndex: number): void {
    annotationMode && setAnnotationMode((annotation) => update(annotation, {endIndex: {$set: endIndex}}));
  }

  function onAnnotationCommentUpdated(comment: string): void {
    annotationMode && setAnnotationMode((annotation) => update(annotation, {comment: {$set: comment}}));
  }

  function cancelAnnotationMode(): void {
    setAnnotationMode(undefined);
  }

  function onAddComment(): void {
    annotationMode && addComment(annotationMode);
    cancelAnnotationMode();
  }

  function onMouseEnterComment(index: number): void {
    setHoveredComment(index);
  }

  function onMouseLeaveComment(): void {
    setHoveredComment(undefined);
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
        <CorrectnessLights correctness={correctness}/>

        {sampleSolutionEntry && userSolutionEntry && <>
          <button type="button" className={classNames('ml-2', 'font-bold', annotationMode ? 'text-red-500' : 'text-blue-500')} title={t('addAnnotation')}
                  onClick={startAnnotationMode}>
            &#x270E;
          </button>
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={() => clearMatch(path)}>&#10005;</button>
        </>}
      </td>

      <td className="p-2 align-text-top">
        {userSolutionEntry && (sampleSolutionEntry
          ? (annotationMode
            ? <AnnotationTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues} selection={annotationMode}/>
            : <SolutionTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues}
                                 markedText={hoveredComment !== undefined ? comments[hoveredComment] : undefined}/>)
          : <UnMatchedUserSolutionEntryTableCell entry={userSolutionEntry} level={level} reductionValues={reductionValues} path={path}/>)}
      </td>

      <td className="p-2 align-text-top">
        {comments.map(({comment}, index) => <p key={index} onMouseEnter={() => onMouseEnterComment(index)} onMouseLeave={onMouseLeaveComment}
                                               className={classNames({'bg-amber-500': index === hoveredComment})}>{comment}</p>)}

        {annotationMode &&
          <AnnotationSubmitForm annotation={annotationMode} maximumValue={userSolutionEntry?.text.length || 0} updateComment={onAnnotationCommentUpdated}
                                updateStartIndex={onAnnotationStartUpdate} updateEndIndex={onAnnotationEndUpdate} onSubmit={onAddComment}/>}
      </td>

    </tr>
  );
}
