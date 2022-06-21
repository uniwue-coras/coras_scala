import {BaseIProps, SolutionTableRow} from './SolutionTableRow';
import {ISolutionNode} from '../myTsModels';

interface IProps extends BaseIProps {
  entry: ISolutionNode;
  path: number[];
  level: number;
}

const emptyReduceValues = {isReducible: false, isReduced: false, toggleIsReduced: () => void 0};

export function NotMatchedUserEntryRow({entry, path, level, createNewMatch, clearMatch, saveMatch}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleSolutionEntry={undefined} userSolutionEntry={entry} comments={[]} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues}
                        clearMatch={clearMatch} addComment={() => void 0} saveMatch={saveMatch}/>

      {entry.children.map((child, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch} saveMatch={saveMatch}/>)}

    </>
  );
}

export function NotMatchedSampleEntryRow({entry, path, level, createNewMatch, clearMatch, saveMatch}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleSolutionEntry={entry} userSolutionEntry={undefined} comments={[]} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues}
                        clearMatch={clearMatch} addComment={() => void 0} saveMatch={saveMatch}/>

      {entry.children.map((child, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                           createNewMatch={createNewMatch} clearMatch={clearMatch} saveMatch={saveMatch}/>)}
    </>
  );
}
