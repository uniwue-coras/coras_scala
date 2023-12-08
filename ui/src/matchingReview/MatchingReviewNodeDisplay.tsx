import { ReactElement } from 'react';
import { RevSolNodeFragment } from '../graphql';
import classNames from 'classnames';
import { getBullet } from '../solutionInput/bulletTypes';

interface IProps {
  depth: number;
  node: RevSolNodeFragment;
}

export function MatchingReviewNodeDisplay({ depth, node }: IProps): ReactElement {
  const { id, childIndex, text, isSubText, applicability, parentId } = node;

  return (
    <div className={classNames({ 'font-bold': !isSubText })}>
      {getBullet(depth, childIndex)}. {text}
    </div>
  );
}
