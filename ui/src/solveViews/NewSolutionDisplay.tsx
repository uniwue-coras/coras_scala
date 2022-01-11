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

  return (
    <>
      {matches.sort(compareTreeMatches).map((m, index) =>
        <MatchDisplay key={index} m={m} level={level} onSelect={onSelect} comparedMatch={comparedMatch} createNewMatch={createNewMatch}
                      path={[...path, index]}/>)}

      {notMatchedSample.map((entry, childIndex) => <div key={childIndex}>
        <NotMatchedSampleEntryRow entry={entry} path={[...path, childIndex]} level={level} createNewMatch={createNewMatch}/>
      </div>)}

      {notMatchedUser.map((entry, childIndex) => <div key={childIndex}>
        <NotMatchedUserEntryRow entry={entry} path={[...path, childIndex]} level={level} createNewMatch={createNewMatch}/>
      </div>)}
    </>
  );
}
