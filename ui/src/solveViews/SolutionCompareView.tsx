import {MouseEvent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NewSolutionDisplay} from './NewSolutionDisplay';
import {analyzeNodeMatch, TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
import update, {Spec} from 'immutability-helper';
import classNames from 'classnames';

interface IProps {
  exerciseId: number;
  username: string;
  treeMatchResult: TreeMatchingResult;
}

interface IState {
  treeMatchResult: TreeMatchingResult;
  comparedMatch?: TreeMatch;
}

function buildSpecFromPath(path: number[], innerSpec: Spec<TreeMatchingResult>): Spec<TreeMatchingResult> {
  return path.reduceRight<Spec<TreeMatchingResult>>(
    (acc, index) => ({matches: {[index]: {childMatches: acc}}}),
    innerSpec
  );
}

export function SolutionCompareView({treeMatchResult: initialTreeMatchResult}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({treeMatchResult: initialTreeMatchResult});

  function onSelect(m: TreeMatch): void {
    setState((state) => update(state, {comparedMatch: {$apply: (currentMatch) => m === currentMatch ? undefined : m}}));
  }

  function clearMatch(event: MouseEvent<HTMLButtonElement>, matchPath: number[]): void {
    event.stopPropagation();

    const pathStart = matchPath.slice(0, matchPath.length - 1);
    const matchIndex = matchPath[matchPath.length - 1];

    setState((state) => {
      const {userSolutionEntry, sampleSolutionEntry} = pathStart
        .reduce((acc, index) => acc.matches[index].childMatches, state.treeMatchResult)
        .matches[matchIndex];

      return update(state, {
        treeMatchResult: buildSpecFromPath(pathStart, {
          matches: {$splice: [[matchIndex, 1]]},
          notMatchedUser: {$push: [userSolutionEntry]},
          notMatchedSample: {$push: [sampleSolutionEntry]}
        })
      });
    });
  }

  function createNewMatch(samplePath: number[], userPath: number[]): void {

    // FIXME: calculate common path prefix

    const samplePathStart = samplePath.slice(0, samplePath.length - 1);
    const sampleIndex = samplePath[samplePath.length - 1];

    const userPathStart = userPath.slice(0, userPath.length - 1);
    const userIndex = userPath[userPath.length - 1];

    if (samplePathStart.join(',') !== userPathStart.join(',')) {
      alert('Not yet supported...');
      return;
    }

    setState((state) => {
      const parentMatchElement = samplePathStart
        .reduce((acc, index) => acc.matches[index].childMatches, state.treeMatchResult);

      const sampleEntry = parentMatchElement.notMatchedSample[sampleIndex];
      const userEntry = parentMatchElement.notMatchedUser[userIndex];

      const newMatch: TreeMatch = analyzeNodeMatch(sampleEntry, userEntry);

      return update(state, {
        treeMatchResult: buildSpecFromPath(samplePathStart, {
            matches: {$push: [newMatch]},
            notMatchedSample: {$splice: [[sampleIndex, 1]]},
            // FIXME: is this always the right not matched user entry...?
            notMatchedUser: {$splice: [[userIndex, 1]]}
          }
        )
      });
    });
  }

  function updateCorrection(spec: Spec<TreeMatchingResult>): void {
    setState((state) => update(state, {treeMatchResult: spec}));
  }

  function onAddAnnotation(): void {
    const selection = window.getSelection();

    if (selection) {
      if (selection.rangeCount === 0) {
        alert('Nothing selected...');
      } else if (selection.rangeCount > 1) {
        alert('Multiple selections not supported...');
      } else {
        const range = selection.getRangeAt(0);
        // TODO: add annotation...
        console.info(range);
      }
    }
  }

  return (
    <div className="container mx-auto border border-slate-200">

      <table className="w-full">
        <colgroup>
          <col span={1} style={{width: '47%'}}/>
          <col span={1} style={{width: '6%'}} className="border-x border-slate-200"/>
          <col span={1} style={{width: '47%'}}/>
        </colgroup>
        <thead>
          <tr>
            <th className="text-center">{t('sampleSolution')}</th>
            <th/>
            <th className="text-center">{t('learnerSolution')}</th>
          </tr>
        </thead>

        <tbody>
          <NewSolutionDisplay treeMatchData={state.treeMatchResult} onSelect={onSelect} comparedMatch={state.comparedMatch} createNewMatch={createNewMatch}
                              clearMatch={clearMatch}/>
        </tbody>
      </table>

      <button type="button" onClick={onAddAnnotation} className={classNames('mt-4', 'p-2', 'rounded', 'bg-blue-500', 'text-white', 'w-full')}>
        {t('addCorrectionAnnotation')}
      </button>

    </div>
  );
}
