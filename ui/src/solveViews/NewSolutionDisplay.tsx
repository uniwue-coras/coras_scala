import {compareTreeMatches, TreeMatchingResult} from '../model/correction/corrector';
import {MatchDisplay} from './MatchDisplay';
import {NotMatchedSampleEntryRow, NotMatchedUserEntryRow} from './NotMatchedEntryRow';
import {BaseIProps} from './SolutionTableRow';

interface IProps extends BaseIProps {
  treeMatchingResult: TreeMatchingResult;
  level?: number;
  path?: number[];
}

export function NewSolutionDisplay({treeMatchingResult, level = 0, createNewMatch, clearMatch, path = []}: IProps): JSX.Element {

  const {matches, notMatchedSample, notMatchedUser} = treeMatchingResult;

  const sortedMatches = matches.sort(compareTreeMatches);

  return (
    <>
      {sortedMatches.map((m, index) =>
        <MatchDisplay key={index} m={m} level={level} createNewMatch={createNewMatch} clearMatch={clearMatch} path={[...path, index]}/>)}

      {notMatchedSample.map((entry, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                             createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}

      {notMatchedUser.map((entry, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}
    </>
  );
}
