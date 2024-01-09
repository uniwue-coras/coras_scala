import { ReactElement } from 'react';
import { FlatUserSolutionNodeFragment } from '../graphql';
import { stringifyApplicability } from '../model/applicability';

interface IProps {
  node: FlatUserSolutionNodeFragment;
}

export function UserSubTextNodesDisplay({ node: { subTextNodes } }: IProps): ReactElement {
  return (
    <>
      {subTextNodes.map(({ text, applicability, annotations }) => <p key={text}>{text} {stringifyApplicability(applicability)}</p>)}
    </>
  );
}
