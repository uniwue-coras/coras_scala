import { ReactElement } from 'react';
import { CurrentMatchFragment, RevSolNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { stringifyApplicability } from '../model/applicability';
import { allMatchColors } from '../allMatchColors';
import { SolNodeMatchExplanation } from './MatchExplanation';
import classNames from 'classnames';

const indentInPixel = 20;

interface IProps {
  isSample: boolean;
  depth: number;
  node: RevSolNodeFragment;
  currentMatch: CurrentMatchFragment | undefined;
}

export function MatchingReviewNodeDisplay({ isSample, depth, node, currentMatch }: IProps): ReactElement {

  const { childIndex, text, isSubText, applicability } = node;

  const matchColor = currentMatch ? allMatchColors[currentMatch.sampleNodeId] : undefined;

  const nodeColumn = (
    <div className={classNames({ 'font-bold': !isSubText })} style={{ marginLeft: `${depth * indentInPixel}px` }}>
      {isSubText ? '' : getBullet(depth, childIndex) + '.'}
      <div className="mx-2 px-2 py-1 inline-block rounded text-justify" style={{ background: matchColor }}>{text}</div>
      {stringifyApplicability(applicability)}
    </div>
  );

  return isSample
    ? nodeColumn
    : (
      <div className="grid grid-cols-2 gap-2">
        {nodeColumn}
        <div className="px-2 py-1">
          {currentMatch && <div className={classNames('italic', isSample ? 'text-right' : 'text-left')}>
            {currentMatch.maybeExplanation && <SolNodeMatchExplanation explanation={currentMatch.maybeExplanation} />}
          </div>}
        </div >
      </div>
    );
}
