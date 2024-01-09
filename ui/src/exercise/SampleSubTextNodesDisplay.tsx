import { ReactElement } from 'react';
import { FlatSampleSolutionNodeFragment } from '../graphql';
import { stringifyApplicability } from '../model/applicability';

interface IProps {
  node: FlatSampleSolutionNodeFragment;
}

export function SampleSubTextNodesDisplay({ node: { subTextNodes } }: IProps): ReactElement {
  return (
    <>
      {subTextNodes.map(({ text, applicability }) => <p key={text}>{text} {stringifyApplicability(applicability)}</p>)}
    </>
  );

}
