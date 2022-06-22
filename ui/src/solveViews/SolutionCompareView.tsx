import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NewSolutionDisplay} from './NewSolutionDisplay';
import {analyzeNodeMatch} from '../model/correction/corrector';
import update, {Spec} from 'immutability-helper';
import {ISolutionMatchComment, ISolutionNodeMatchingResult} from '../myTsModels';
import useAxios from 'axios-hooks';

interface IProps {
  exerciseId: number;
  username: string;
  treeMatchResult: ISolutionNodeMatchingResult;
}

interface IState {
  treeMatchResult: ISolutionNodeMatchingResult;
  correctionChanged: boolean;
  hideSubTexts: boolean;
}

function buildSpecFromPath(path: number[], innerSpec: Spec<ISolutionNodeMatchingResult>): Spec<ISolutionNodeMatchingResult> {
  return path.reduceRight<Spec<ISolutionNodeMatchingResult>>(
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
  const [state, setState] = useState<IState>({treeMatchResult: initialTreeMatchResult, correctionChanged: false, hideSubTexts: false});
  // FIXME: use value correctionChanged!

  // FIXME: return value!
  const [{data, loading, error}, saveCorrection] = useAxios<any, ISolutionNodeMatchingResult>(
    {url: `/exercises/${exerciseId}/solutions/${username}/correction`, method: 'post'},
    {manual: true}
  );

  function toggleSubTexts(): void {
    setState((state) => update(state, {hideSubTexts: {$apply: (value) => !value}}));
  }

  function onSubmitCorrection(): void {
    console.info('Submitting correction...');
    saveCorrection({data: state.treeMatchResult})
      .catch((error) => console.error(error))
      .then((res) => {
        setState((state) => update(state, {correctionChanged: {$set: false}}));
      });
  }

  function clearMatch(matchPath: number[]): void {
    const [pathStart, matchIndex] = pathStartAndEnd(matchPath);

    setState((state) => {
      const {userValue, sampleValue} = pathStart
        .reduce((acc, index) => acc.matches[index].childMatches, state.treeMatchResult)
        .matches[matchIndex];

      return update(state, {
        correctionChanged: {$set: true},
        treeMatchResult: buildSpecFromPath(pathStart, {
          matches: {$splice: [[matchIndex, 1]]},
          notMatchedUser: {$push: [userValue]},
          notMatchedSample: {$push: [sampleValue]}
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

      return update(state, {
        correctionChanged: {$set: true},
        treeMatchResult: buildSpecFromPath(samplePathStart, {
            matches: {$push: [analyzeNodeMatch(sampleEntry, userEntry)]},
            notMatchedSample: {$splice: [[sampleIndex, 1]]},
            notMatchedUser: {$splice: [[userIndex, 1]]}
          }
        )
      });
    });
  }

  function addComment(comment: ISolutionMatchComment, path: number[]): void {
    setState((state) => {
      const [pathStart, entryIndex] = pathStartAndEnd(path);

      return update(state, {
        correctionChanged: {$set: true},
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
          <th className="w-[5%] text-center">
            <button type="button" onClick={toggleSubTexts}>
              {state.hideSubTexts ? <span>&#x1f47e;</span> : <span>&#x1f47b;</span>}
            </button>
            &nbsp;&nbsp;&nbsp;
            <button type="button" onClick={onSubmitCorrection} title={t('submitCorrection')}>&#x1f4be;</button>
          </th>
          <th className="w-[35%] text-center">{t('learnerSolution')}</th>
          <th className="w-[25%]"/>
        </tr>
      </thead>
      <tbody>
        <NewSolutionDisplay treeMatchingResult={state.treeMatchResult} createNewMatch={createNewMatch} clearMatch={clearMatch} addComment={addComment}
                            hideSubTexts={state.hideSubTexts}/>
      </tbody>
    </table>
  );
}
