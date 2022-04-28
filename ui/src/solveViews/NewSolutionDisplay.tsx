import {compareTreeMatches, TreeMatch, TreeMatchingResult} from '../model/correction/corrector';
import {MatchDisplay} from './MatchDisplay';
import {NotMatchedSampleEntryRow, NotMatchedUserEntryRow} from './NotMatchedEntryRow';

interface IProps {
  treeMatchData: TreeMatchingResult;
  onSelect: (m: TreeMatch) => void;
  comparedMatch: TreeMatch | undefined;
  level?: number;
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  path?: number[];
}

export function NewSolutionDisplay({treeMatchData, onSelect, comparedMatch, level = 0, createNewMatch, path = []}: IProps): JSX.Element {

  const {matches, notMatchedSample, notMatchedUser} = treeMatchData;

  const sortedMatches = matches.sort(compareTreeMatches);

  return (
    <>
      {sortedMatches.map((m, index) =>
        <MatchDisplay key={index} m={m} level={level} onSelect={onSelect} comparedMatch={comparedMatch} createNewMatch={createNewMatch}
                      path={[...path, index]}/>)}

      {notMatchedSample.map((entry, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                             createNewMatch={createNewMatch}/>)}

      {notMatchedUser.map((entry, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                         createNewMatch={createNewMatch}/>)}
    </>
  );
}
