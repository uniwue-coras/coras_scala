import {SolutionTableRow} from './SolutionTableRow';
import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';

interface IProps {
  entry: NumberedAnalyzedSolutionEntry;
  path: number[];
  level: number;
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
}

const emptyReduceValues = {isReducible: false, isReduced: false, toggleIsReduced: () => void 0};

export function NotMatchedUserEntryRow({entry, path, level, createNewMatch}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleEntry={undefined} userEntry={entry} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues}/>

      {entry.children.map((child, childIndex) => <div key={childIndex}>
        <NotMatchedUserEntryRow entry={child} level={level + 1} path={[...path, childIndex]} createNewMatch={createNewMatch}/>
      </div>)}
    </>
  );
}

export function NotMatchedSampleEntryRow({entry, path, level, createNewMatch}: IProps): JSX.Element {
  return (
    <>
      <SolutionTableRow sampleEntry={entry} userEntry={undefined} level={level} path={path} createNewMatch={createNewMatch}
                        reductionValues={emptyReduceValues}/>

      {entry.children.map((child, childIndex) => <div key={childIndex}>
        <NotMatchedSampleEntryRow entry={child} level={level + 1} path={[...path, childIndex]} createNewMatch={createNewMatch}/>
      </div>)}
    </>
  );
}
