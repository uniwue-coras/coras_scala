import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {MatchExplanationView} from './MatchExplanationView';
import classNames from 'classnames';
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
  comparedMatch?: TreeMatch;
}

function calculateCommonPrefix(p1: number[], p2: number[]): number[] {
  const prefix: number[] = [];

  for (let i = 0; i < Math.min(p1.length, p2.length); i++) {
    if (p1[i] === p2[i]) {
      prefix.push(p1[i]);
    } else {
      break;
    }
  }

  return prefix;
}

export function SolutionCompareView({/*exerciseId, username,*/ treeMatchResult: initialTreeMatchResult}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({treeMatchResult: initialTreeMatchResult});
  // const [/*submitCorrection*/, {data, loading, error}] = useSubmitCorrectionMutation();

  function onSelect(m: TreeMatch): void {
    setState((state) => update(state, {comparedMatch: {$apply: (currentMatch) => m === currentMatch ? undefined : m}}));
  }

  function onSubmit(): void {
    console.error('TODO: implement!');
    /*
    const entryCorrections = matches.map((m) => convertEntryMatch(m));

    submitCorrection({variables: {exerciseId, username, entryCorrections}})
      .then(({data}) => console.info(JSON.stringify(data)))
      .catch((error) => console.error(error));
     */
  }

  function createNewMatch(samplePath: number[], userPath: number[]): void {

    // FIXME: calculate common path prefix

    const samplePathStart = samplePath.slice(0, samplePath.length - 1);
    const sampleIndex = samplePath[samplePath.length - 1];

    const userPathStart = userPath.slice(0, userPath.length - 1);
    const userIndex = userPath[userPath.length - 1];

    const commonPathPrefix = calculateCommonPrefix(samplePathStart, userPathStart);

    const sampleEntry = samplePathStart
      .reduce((acc, index) => acc.matches[index].childMatches, state.treeMatchResult)
      .notMatchedSample[sampleIndex];

    const userEntry = userPathStart
      .reduce((acc, index) => acc.matches[index].childMatches, state.treeMatchResult)
      .notMatchedUser[userIndex];

    const newMatch: TreeMatch = analyzeNodeMatch(sampleEntry, userEntry);

    const innerUpdate = samplePathStart
      .slice(commonPathPrefix.length)
      .reduceRight<Spec<TreeMatchingResult>>(
        (acc, index) => ({matches: {[index]: {childMatches: acc}}}),
        {
          matches: {$push: [newMatch]},
          notMatchedSample: {$splice: [[sampleIndex, 1]]},
          // FIXME: is this always the right not matched user entry...?
          notMatchedUser: {$splice: [[userIndex, 1]]}
        }
      );

    setState((state) => update(state, {
      treeMatchResult: commonPathPrefix.reduceRight<Spec<TreeMatchingResult>>(
        (acc, index) => ({matches: {[index]: {childMatches: acc}}}),
        innerUpdate
      )
    }));
  }

  function updateCorrection(spec: Spec<TreeMatchingResult>): void {
    setState((state) => update(state, {treeMatchResult: spec}));
  }

  return (
    <div className="columns">

      <div className="column">

        <div className="columns">
          <div className="column has-text-centered">{t('sampleSolution')}</div>
          <div className="column has-text-centered">{t('learnerSolution')}</div>
        </div>

        <NewSolutionDisplay treeMatchData={state.treeMatchResult} onSelect={onSelect} comparedMatch={state.comparedMatch} createNewMatch={createNewMatch}/>
      </div>


      <div className="column is-one-quarter">
        <h2 className="subtitle is-4 has-text-centered">{t('comparison')}</h2>

        {state.comparedMatch
          ? <MatchExplanationView entry={state.comparedMatch} updateCorrection={updateCorrection}/> // FIXME: key!
          : <div className="notification is-primary has-text-centered">{t('noEntrySelected')}</div>}

        {/*error && <div className="notification is-danger has-text-centered">{error.message}</div>*/}

        {/*!!data?.exercise?.solution?.submitCorrection && <div className="notification is-success has-text-centered">{t('correctionSubmitted')}</div>*/}

        <hr/>

        <button type="button" className={classNames('button', 'is-link', 'is-fullwidth'/*, {'is-loading': loading}*/)} onClick={onSubmit} disabled={true /*loading*/}>
          {t('submitCorrection')}
        </button>
      </div>

    </div>
  );
}
