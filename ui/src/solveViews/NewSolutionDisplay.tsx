import {compareTreeMatches} from '../model/correction/corrector';
import {MatchDisplay} from './MatchDisplay';
import {NotMatchedSampleEntryRow, NotMatchedUserEntryRow} from './NotMatchedEntryRow';
import {BaseIProps} from './SolutionTableRow';
import {ISolutionMatchComment, ISolutionNodeMatchingResult} from '../myTsModels';

interface IProps extends BaseIProps {
  treeMatchingResult: ISolutionNodeMatchingResult;
  level?: number;
  path?: number[];
  addComment: (comment: ISolutionMatchComment, path: number[]) => void;
}

export function NewSolutionDisplay({treeMatchingResult, level = 0, createNewMatch, clearMatch, path = [], addComment, hideSubTexts}: IProps): JSX.Element {

  const {matches, notMatchedSample, notMatchedUser} = treeMatchingResult;

  const sortedMatches = matches.sort(compareTreeMatches);

  return (
    <>
      {sortedMatches.map((m, index) =>
        <MatchDisplay key={index} m={m} level={level} createNewMatch={createNewMatch} clearMatch={clearMatch} path={[...path, index]}
                      addComment={addComment} hideSubTexts={hideSubTexts}/>)}

      {notMatchedSample.map((entry, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                             createNewMatch={createNewMatch} clearMatch={clearMatch} hideSubTexts={hideSubTexts}/>)}

      {notMatchedUser.map((entry, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={entry} path={[...path, childIndex]} level={level}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch} hideSubTexts={hideSubTexts}/>)}
    </>
  );
}
