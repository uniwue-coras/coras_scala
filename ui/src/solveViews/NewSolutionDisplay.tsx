import {compareTreeMatches, TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
import {MatchDisplay} from './MatchDisplay';
import {NotMatchedSampleEntryRow, NotMatchedUserEntryRow} from './NotMatchedEntryRow';
import {BaseIProps} from './SolutionTableRow';

interface IProps extends BaseIProps {
  treeMatchData: TreeMatchingResult;
  onSelect: (m: TreeMatch) => void;
  comparedMatch: TreeMatch | undefined;
  level?: number;
  path?: number[];
}

export function NewSolutionDisplay({treeMatchData, onSelect, comparedMatch, level = 0, createNewMatch, clearMatch, path = []}: IProps): JSX.Element {

  const {matches, notMatchedSample, notMatchedUser} = treeMatchData;

  const sortedMatches = matches.sort(compareTreeMatches);

  return (
    <>
      {sortedMatches.map((m, index) =>
        <MatchDisplay key={index} m={m} level={level} onSelect={onSelect} comparedMatch={comparedMatch} createNewMatch={createNewMatch} clearMatch={clearMatch}
                      path={[...path, index]}/>)}

      {notMatchedSample.map((entry, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                             createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}

      {notMatchedUser.map((entry, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}
    </>
  );
}
