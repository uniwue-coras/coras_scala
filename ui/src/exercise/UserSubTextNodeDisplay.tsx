import { ReactElement } from 'react';
import { FlatUserSolutionNodeFragment } from '../graphql';
import { stringifyApplicability } from '../model/applicability';

interface IProps {
  node: FlatUserSolutionNodeFragment;
}

export function UserSubTextNodesDisplay({ node: { subTextNodes } }: IProps): ReactElement {
  return (
    <>
      {subTextNodes.map(({ text, applicability, annotations }) => <div key={text}>
        <p>{text} {stringifyApplicability(applicability)}</p>
        {annotations.map((annotation, index) => <p key={index}>{JSON.stringify(annotation, null, 2)}</p>)}
      </div>)}
    </>
  );
}
