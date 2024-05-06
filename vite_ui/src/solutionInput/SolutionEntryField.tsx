import { ReactElement, useState } from 'react';
import { RawSolutionNode } from './solutionEntryNode';
import { getBullet } from './bulletTypes';
import { stringifyApplicability } from '../model/applicability';
import update from 'immutability-helper';

interface IProps {
  entry: RawSolutionNode;
  index: number;
  depth?: number;
}

interface IState {
  isReduced: boolean;
  hoveredParagraphCitation: number | undefined;
}

export function SolutionEntryField({ entry, index, depth = 0 }: IProps): ReactElement {

  const [state, setState] = useState<IState>({ isReduced: false, hoveredParagraphCitation: undefined });

  const { isSubText, text, applicability, children } = entry;

  const toggleIsReduced = () => setState((state) => update(state, { isReduced: (value) => !value }));

  return (
    <>
      <div className="my-2">
        {!isSubText && <span className="p-1">{getBullet(depth, index)}.</span>}

        {children.length > 0 && <button type="button" className="p-1 text-slate-500 font-bold" onClick={toggleIsReduced}>
          {state.isReduced ? <span>&gt;</span> : <span>&#x2335;</span>}
        </button>}

        &nbsp;

        {text}

        &nbsp;

        {stringifyApplicability(applicability)}
      </div>

      {!state.isReduced && <div className="my-2 ml-10">

        {children.map((entry, index) =>
          <SolutionEntryField key={index} entry={entry} index={index} depth={depth + 1} />
        )}
      </div>}
    </>
  );
}
