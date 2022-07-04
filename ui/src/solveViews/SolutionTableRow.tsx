import {ReductionValues, SolutionTableCell,} from './SolutionTableCell';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {AnnotationSubmitForm} from './AnnotationSubmitForm';
import {UnMatchedSampleSolutionEntryTableCell, UnMatchedUserSolutionEntryTableCell} from './UnMatchedSolutionTableCell';
import update from 'immutability-helper';
import {CorrectnessLights} from './CorrectnessLights';
import {ISolutionMatchComment, ISolutionNode} from '../myTsModels';

export enum Correctness {
  COMPLETE, PARTIAL, NONE
}

export interface BaseIProps {
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  clearMatch: (path: number[]) => void;
  hideSubTexts: boolean;
}

interface IProps extends BaseIProps {
  sampleValue: ISolutionNode | undefined;
  userValue: ISolutionNode | undefined;
  comments: ISolutionMatchComment[],
  addComment: (comment: ISolutionMatchComment) => void;
  level: number;
  correctness?: Correctness;
  reductionValues: ReductionValues;
  path: number[];
}

export function SolutionTableRow({
  sampleValue,
  userValue,
  comments,
  addComment,
  level,
  correctness = Correctness.NONE,
  reductionValues,
  path,
  createNewMatch,
  clearMatch,
  hideSubTexts
}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const [annotationMode, setAnnotationMode] = useState<undefined | ISolutionMatchComment>();
  const [hoveredComment, setHoveredComment] = useState<number>();


  function startAnnotationMode(): void {
    setAnnotationMode({startIndex: 0, endIndex: userValue?.text.length || 0, comment: ''});
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
        {sampleValue && (userValue
          ? <SolutionTableCell entry={sampleValue} level={level} reductionValues={reductionValues} hideSubTexts={hideSubTexts}/>
          : <UnMatchedSampleSolutionEntryTableCell entry={sampleValue} level={level} reductionValues={reductionValues} path={path}
                                                   createNewMatch={createNewMatch} hideSubTexts={hideSubTexts}/>)}
      </td>

      <td className="p-2 align-text-top">
        <CorrectnessLights correctness={correctness}/>

        {sampleValue && userValue && <>
          <button type="button" className={classNames('ml-2', 'font-bold', annotationMode ? 'text-red-500' : 'text-blue-500')} title={t('addAnnotation')}
                  onClick={startAnnotationMode}>
            &#x1F5E9;
          </button>
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={() => clearMatch(path)}>&#10005;</button>
        </>}
      </td>

      <td className="p-2 align-text-top">
        {userValue && (sampleValue
          ? <SolutionTableCell entry={userValue} level={level} reductionValues={reductionValues}
                               markedText={hoveredComment !== undefined ? comments[hoveredComment] : undefined} hideSubTexts={hideSubTexts}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userValue} level={level} reductionValues={reductionValues} path={path} hideSubTexts={hideSubTexts}/>)}
      </td>

      <td className="p-2 align-text-top">
        {comments.map(({comment}, index) => <p key={index} onMouseEnter={() => onMouseEnterComment(index)} onMouseLeave={onMouseLeaveComment}
                                               className={classNames({'bg-amber-500': index === hoveredComment})}>{comment}</p>)}

        {annotationMode &&
          <AnnotationSubmitForm annotation={annotationMode} maximumValue={userValue?.text.length || 0} updateComment={onAnnotationCommentUpdated}
                                updateStartIndex={onAnnotationStartUpdate} updateEndIndex={onAnnotationEndUpdate} onCancel={cancelAnnotationMode}
                                onSubmit={onAddComment}/>}
      </td>

    </tr>
  );
}
