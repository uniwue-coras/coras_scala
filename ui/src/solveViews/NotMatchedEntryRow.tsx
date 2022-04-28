import {BaseIProps, SolutionTableRow} from './SolutionTableRow';
import {NumberedAnalyzedSolutionEntry} from '../solutionInput/solutionEntryNode';

interface IProps extends BaseIProps {
  entry: NumberedAnalyzedSolutionEntry;
  path: number[];
  level: number;
}

const emptyReduceValues = {isReducible: false, isReduced: false, toggleIsReduced: () => void 0};

export function NotMatchedUserEntryRow({entry, path, level, createNewMatch, clearMatch}: IProps): JSX.Element {
  return (
    <>
      <tr className="border border-amber-200">
        <SolutionTableRow sampleEntry={undefined} userEntry={entry} level={level} path={path} createNewMatch={createNewMatch}
                          reductionValues={emptyReduceValues} clearMatch={clearMatch}/>
      </tr>

      {entry.children.map((child, childIndex) => <NotMatchedUserEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                         createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}

    </>
  );
}

export function NotMatchedSampleEntryRow({entry, path, level, createNewMatch, clearMatch}: IProps): JSX.Element {
  return (
    <>
      <tr className="border border-emerald-200">
        <SolutionTableRow sampleEntry={entry} userEntry={undefined} level={level} path={path} createNewMatch={createNewMatch}
                          reductionValues={emptyReduceValues} clearMatch={clearMatch}/>
      </tr>

      {entry.children.map((child, childIndex) => <NotMatchedSampleEntryRow key={childIndex} entry={child} level={level + 1} path={[...path, childIndex]}
                                                                           createNewMatch={createNewMatch} clearMatch={clearMatch}/>)}
    </>
  );
}
