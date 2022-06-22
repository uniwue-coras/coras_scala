import {BaseIProps, SolutionTableRow} from './SolutionTableRow';
import {ISolutionNode} from '../myTsModels';

interface IProps extends BaseIProps {
  entry: ISolutionNode;
  path: number[];
  level: number;
}

const emptyReduceValues = {isReducible: false, isReduced: false, toggleIsReduced: () => void 0};

export function NotMatchedUserEntryRow({entry, path, level, createNewMatch, clearMatch, hideSubTexts}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleValue={undefined} userValue={entry} comments={[]} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues} clearMatch={clearMatch} addComment={() => void 0} hideSubTexts={hideSubTexts}/>

      {entry.children.map((child, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch} hideSubTexts={hideSubTexts}/>)}

    </>
  );
}

export function NotMatchedSampleEntryRow({entry, path, level, createNewMatch, clearMatch, hideSubTexts}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleValue={entry} userValue={undefined} comments={[]} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues} clearMatch={clearMatch} addComment={() => void 0} hideSubTexts={hideSubTexts}/>

      {entry.children.map((child, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                           createNewMatch={createNewMatch} clearMatch={clearMatch}
                                                                           hideSubTexts={hideSubTexts}/>)}
    </>
  );
}
