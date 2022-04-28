import {TreeMatch} from '../model/correction/corrector';
import {MouseEvent, useState} from 'react';
import classNames from 'classnames';
import {Correctness, SolutionTableRow} from './SolutionTableRow';
import {NewSolutionDisplay} from './NewSolutionDisplay';

interface IProps {
  m: TreeMatch;
  level: number;
  onSelect: (m: TreeMatch) => void;
  comparedMatch: TreeMatch | undefined;
  createNewMatch: (samplePath: number[], userPath: number[]) => void;
  path: number[];
}

export function MatchDisplay({m, level, onSelect, comparedMatch, createNewMatch, path}: IProps): JSX.Element {

  const {sampleSolutionEntry, userSolutionEntry, /* analysis,*/ childMatches} = m;

  const isSelected = m === comparedMatch;
  const isReducible = m.childMatches.matches.length > 0 || m.childMatches.notMatchedSample.length > 0 || m.childMatches.notMatchedUser.length > 0;
  const [isReduced, setIsReduced] = useState(false);

  function toggleIsReduced(event: MouseEvent<HTMLSpanElement>): void {
    event.stopPropagation();
    setIsReduced((value) => !value);
  }

  // FIXME: calculate correctness?
  const correctness: Correctness = 'matchAnalysis' in m ? Correctness.PARTIAL : Correctness.COMPLETE;

  return (
    <>
      <tr onClick={() => onSelect(m)} className={classNames('border', 'border-cyan-200', {'box': isSelected})}>
        <SolutionTableRow
          sampleEntry={sampleSolutionEntry}
          userEntry={userSolutionEntry}
          level={level}
          correctness={correctness}
          reductionValues={{isReducible, isReduced, toggleIsReduced}}
          path={path}
          createNewMatch={createNewMatch} isSelected={isSelected}/>
      </tr>

      {!isReduced && <NewSolutionDisplay treeMatchData={childMatches} level={level + 1} onSelect={onSelect} comparedMatch={comparedMatch}
                                         createNewMatch={createNewMatch} path={path}/>}

    </>
  );
}
