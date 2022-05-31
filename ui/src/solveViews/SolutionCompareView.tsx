import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NewSolutionDisplay} from './NewSolutionDisplay';
import {analyzeNodeMatch, TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
import update, {Spec} from 'immutability-helper';

interface IProps {
  exerciseId: number;
  username: string;
  treeMatchResult: TreeMatchingResult;
}

interface IState {
  treeMatchResult: TreeMatchingResult;
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

  function clearMatch(matchPath: number[]): void {
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

  return (
    <table className="px-2 mt-2 w-full">
      <thead>
        <tr>
          <th className="col-span-4 text-center">{t('sampleSolution')}</th>
          <th/>
          <th className="col-span-4 text-center">{t('learnerSolution')}</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        <NewSolutionDisplay treeMatchingResult={state.treeMatchResult} createNewMatch={createNewMatch} clearMatch={clearMatch}/>
      </tbody>
    </table>
  );
}
