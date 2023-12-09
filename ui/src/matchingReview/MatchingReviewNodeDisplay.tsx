import { ReactElement } from 'react';
import { RevSolNodeFragment } from '../graphql';
import { getBullet } from '../solutionInput/bulletTypes';
import { stringifyApplicability } from '../model/applicability';
import classNames from 'classnames';

interface IProps {
  depth: number;
  node: RevSolNodeFragment;
  matchColor: string | undefined;
}

export function MatchingReviewNodeDisplay({ depth, node, matchColor }: IProps): ReactElement {
  const { childIndex, text, isSubText, applicability } = node;

  return (
    <div className={classNames({ 'font-bold': !isSubText })}>
      {isSubText ? '' : getBullet(depth, childIndex) + '.'}
      <div className="mx-2 p-1 inline-block rounded text-justify" style={{ background: matchColor }}>{text}</div>
      {stringifyApplicability(applicability)}
    </div>
  );
}
