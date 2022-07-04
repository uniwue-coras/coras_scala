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

interface IState {
  annotation?: ISolutionMatchComment;
  hoveredComment?: number;
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
  const [state, setState] = useState<IState>({});

  function startAnnotationMode(): void {
    setState((state) => update(state, {annotation: {$set: {startIndex: 0, endIndex: userValue?.text.length || 0, comment: ''}}}));
  }

  function onAnnotationStartUpdate(startIndex: number): void {
    state.annotation && setState((state) => update(state, {annotation: {startIndex: {$set: startIndex}}}));
  }

  function onAnnotationEndUpdate(endIndex: number): void {
    state.annotation && setState((state) => update(state, {annotation: {endIndex: {$set: endIndex}}}));
  }

  function onAnnotationCommentUpdated(comment: string): void {
    state.annotation && setState((state) => update(state, {annotation: {comment: {$set: comment}}}));
  }

  function onAddComment(): void {
    state.annotation && addComment(state.annotation);
    cancelAnnotationMode();
  }

  const cancelAnnotationMode = () => setState((state) => update(state, {annotation: {$set: undefined}}));

  const onMouseEnterComment = (index: number) => setState((state) => update(state, {hoveredComment: {$set: index}}));

  const onMouseLeaveComment = () => setState((state) => update(state, {hoveredComment: undefined}));

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
          <button type="button" className={classNames('ml-2', 'font-bold', state.annotation ? 'text-red-500' : 'text-blue-500')} title={t('addAnnotation')}
                  onClick={startAnnotationMode}>
            &#x1F5E9;
          </button>
          <button type="button" className="ml-2 text-red-500 font-bold" title={t('clearMatch')} onClick={() => clearMatch(path)}>&#10005;</button>
        </>}
      </td>

      <td className="p-2 align-text-top">
        {userValue && (sampleValue
          ? <SolutionTableCell entry={userValue} level={level} reductionValues={reductionValues}
                               markedText={state.hoveredComment !== undefined ? comments[state.hoveredComment] : undefined} hideSubTexts={hideSubTexts}/>
          : <UnMatchedUserSolutionEntryTableCell entry={userValue} level={level} reductionValues={reductionValues} path={path} hideSubTexts={hideSubTexts}/>)}
      </td>

      <td className="p-2 align-text-top">
        {comments.map(({comment}, index) => <p key={index} onMouseEnter={() => onMouseEnterComment(index)} onMouseLeave={onMouseLeaveComment}
                                               className={classNames({'bg-amber-500': index === state.hoveredComment})}>{comment}</p>)}

        {state.annotation &&
          <AnnotationSubmitForm annotation={state.annotation} maximumValue={userValue?.text.length || 0} updateComment={onAnnotationCommentUpdated}
                                updateStartIndex={onAnnotationStartUpdate} updateEndIndex={onAnnotationEndUpdate} onCancel={cancelAnnotationMode}
                                onSubmit={onAddComment}/>}
      </td>

    </tr>
  );
}
