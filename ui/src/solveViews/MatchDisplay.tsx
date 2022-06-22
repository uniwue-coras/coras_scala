import {useState} from 'react';
import {BaseIProps, Correctness, SolutionTableRow} from './SolutionTableRow';
import {NewSolutionDisplay} from './NewSolutionDisplay';
import {ISolutionMatchComment, ISolutionNodeMatch} from '../myTsModels';

interface IProps extends BaseIProps {
  m: ISolutionNodeMatch;
  level: number;
  path: number[];
  addComment: (comment: ISolutionMatchComment, path: number[]) => void;
}

export function MatchDisplay({m, level, createNewMatch, clearMatch, path, addComment, hideSubTexts}: IProps): JSX.Element {

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
        createNewMatch={createNewMatch}
        hideSubTexts={hideSubTexts}/>

      {!isReduced &&
        <NewSolutionDisplay treeMatchingResult={m.childMatches} level={level + 1} createNewMatch={createNewMatch} clearMatch={clearMatch} path={path}
                            addComment={addComment} hideSubTexts={hideSubTexts}/>}

    </>
  );
}
