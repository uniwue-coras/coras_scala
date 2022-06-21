import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NewSolutionDisplay} from './NewSolutionDisplay';
import {analyzeNodeMatch, SolutionEntryComment, TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
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

function pathStartAndEnd(path: number[]): [number[], number] {
  return [
    path.slice(0, path.length - 1),
    path[path.length - 1]
  ];
}

export function SolutionCompareView({exerciseId, username, treeMatchResult: initialTreeMatchResult}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({treeMatchResult: initialTreeMatchResult});

  /*
  const [saveMatch] = useSaveMatchMutation();

  function onSaveMatch(sampleNodeId: number, userNodeId: number): void {
    // FIXME: define matchId & parentMatchId!
    saveMatch({variables: {exerciseId, username, nodeMatchInput: {matchId: -1, sampleNodeId, userNodeId, parentMatchId: undefined}}})
      .then(({data}) => console.info(data?.exercise?.solution.saveMatch))
      .catch((error) => console.error(error));
  }
   */

  function clearMatch(matchPath: number[]): void {
    const [pathStart, matchIndex] = pathStartAndEnd(matchPath);

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
    const [samplePathStart, sampleIndex] = pathStartAndEnd(samplePath);
    const [userPathStart, userIndex] = pathStartAndEnd(userPath);

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
            notMatchedUser: {$splice: [[userIndex, 1]]}
          }
        )
      });
    });
  }

  function addComment(comment: SolutionEntryComment, path: number[]): void {
    setState((state) => {
      const [pathStart, entryIndex] = pathStartAndEnd(path);

      return update(state, {
        treeMatchResult: buildSpecFromPath(pathStart, {
          matches: {[entryIndex]: {comments: {$push: [comment]}}}
        })
      });
    });
  }

  return (
    <table className="px-2 mt-2 w-full">
      <thead>
        <tr>
          <th className="w-[35%] text-center">{t('sampleSolution')}</th>
          <th className="w-[5%] text-center"/>
          <th className="w-[35%] text-center">{t('learnerSolution')}</th>
          <th className="w-[25%]"/>
        </tr>
      </thead>
      <tbody>
        <NewSolutionDisplay treeMatchingResult={state.treeMatchResult} createNewMatch={createNewMatch} clearMatch={clearMatch} addComment={addComment}
                            saveMatch={() => void 0 /* onSaveMatch */}/>
      </tbody>
    </table>
  );
}
