import {SolutionEntryComment, TreeMatch} from '../model/correction/corrector';
import {useState} from 'react';
import {BaseIProps, Correctness, SolutionTableRow} from './SolutionTableRow';
import {NewSolutionDisplay} from './NewSolutionDisplay';

interface IProps extends BaseIProps {
  m: TreeMatch;
  level: number;
  path: number[];
  addComment: (comment: SolutionEntryComment, path: number[]) => void;
}

export function MatchDisplay({m, level, createNewMatch, clearMatch, path, addComment}: IProps): JSX.Element {

  const isReducible = m.childMatches.matches.length > 0 || m.childMatches.notMatchedSample.length > 0 || m.childMatches.notMatchedUser.length > 0;
  const [isReduced, setIsReduced] = useState(false);

  function toggleIsReduced(): void {
    setIsReduced((value) => !value);
  }

  // FIXME: calculate correctness?
  const correctness: Correctness = 'matchAnalysis' in m ? Correctness.PARTIAL : Correctness.COMPLETE;

  return (
    <>
      <SolutionTableRow
        {...m}
        addComment={(comment) => addComment(comment, path)}
        level={level}
        correctness={correctness}
        reductionValues={{isReducible, isReduced, toggleIsReduced}}
        path={path}
        clearMatch={clearMatch}
        createNewMatch={createNewMatch}/>

      {!isReduced &&
        <NewSolutionDisplay treeMatchingResult={m.childMatches} level={level + 1} createNewMatch={createNewMatch} clearMatch={clearMatch} path={path}
                            addComment={addComment}/>}

    </>
  );
}
