import { IDocxText } from '../myTsModels';
import { readDocument } from './docxFileReader';
import { RawSolutionNode } from '../solutionInput/solutionEntryNode';
import { Applicability } from '../graphql';
import { describe, test, expect } from 'vitest';

const inputLines: IDocxText[] = [
  { level: 1, text: 'A (+)' },
  { level: 2, text: 'I (+)' },
  { level: 3, text: '1 (+)' },
  { level: 3, text: '2 (+)' },
  { level: 4, text: 'a (+)' },
  { text: 'text' },
  { text: 'text' },
  { text: 'text (+)' },
  { text: 'text' },
  { level: 4, text: 'b (+)' },
  { level: 4, text: 'c (+)' },
  { level: 2, text: 'II (+)' },
  { text: 'text' },
  { level: 3, text: '1 (-)' },
  { text: 'text' },
  { text: 'text' },
  { level: 3, text: '2 (-)' },
  { text: 'text (-)' },
  { level: 3, text: '3 (-)' },
  { text: 'text' },
  { level: 3, text: '4 (-)' },
  { text: 'text' },
  { text: 'text' },
  { text: 'text' },
  { level: 3, text: '5 (+)' },
  { text: 'text (+)' },
  { level: 2, text: 'III (+)' },
  { text: 'text (+)' },
  { level: 2, text: 'IV (+)' },
  { text: 'text (+)' },
  { level: 2, text: 'V (+)' },
  { level: 3, text: '1 (+)' },
  { level: 4, text: 'a (+)' },
  { text: 'text' },
  { level: 4, text: 'b (+)' },
  { text: 'text' },
  { level: 3, text: '2 (+)' },
  { level: 4, text: 'a (+)' },
  { text: 'text' },
  { text: 'text' },
  { level: 4, text: 'b (+)' },
  { text: 'text' },
  { text: 'text' },
  { level: 2, text: 'VI (+)' },
  { text: 'text (+)' },
  { level: 2, text: 'VII' },
  { level: 2, text: 'VIII (+)' },
  { level: 2, text: 'IX (+)' },
  { text: 'text (+)' },
  { level: 1, text: 'B (-)' },
  { level: 2, text: 'I (+)' },
  { text: 'text (+)' },
  { level: 2, text: 'II (-)' },
  { text: 'text' },
  { level: 3, text: '1 (+)' },
  { text: 'text' },
  { text: 'text (+)' },
  { level: 3, text: '2 (-)' },
  { text: 'text (-)' },
  { text: 'text' },
  { text: 'text' },
  { level: 2, text: 'III (-)' },
  { level: 2, text: 'IV (-)' },
  { text: 'text' },
  { level: 1, text: 'C' },
  { text: 'text (+)' },
  { text: 'text (-)' },
  { text: 'text' }
];

function node(text: string, applicability: Applicability, children: RawSolutionNode[]): RawSolutionNode {
  return { isSubText: false, text, applicability, children };
}

function leafNode(text: string, applicability: Applicability): RawSolutionNode {
  return node(text, applicability, []);
}

function textNode(text: string, applicability = Applicability.NotSpecified): RawSolutionNode {
  return { isSubText: true, text, applicability, children: [] };
}

const awaitedResult: RawSolutionNode[] = [
  node('A', Applicability.Applicable, [
    node('I', Applicability.Applicable, [
      leafNode('1', Applicability.Applicable),
      node('2', Applicability.Applicable, [
        node('a', Applicability.Applicable, [
          textNode('text'),
          textNode('text'),
          textNode('text', Applicability.Applicable),
          textNode('text'),
        ]),
        leafNode('b', Applicability.Applicable),
        leafNode('c', Applicability.Applicable),
      ]),
    ]),
    node('II', Applicability.Applicable, [
      textNode('text'),
      node('1', Applicability.NotApplicable, [
        textNode('text'),
        textNode('text'),
      ]),
      node('2', Applicability.NotApplicable, [
        textNode('text', Applicability.NotApplicable),
      ]),
      node('3', Applicability.NotApplicable, [
        textNode('text'),
      ]),
      node('4', Applicability.NotApplicable, [
        textNode('text'),
        textNode('text'),
        textNode('text'),
      ]),
      node('5', Applicability.Applicable, [
        textNode('text', Applicability.Applicable),
      ]),
    ]),
    node('III', Applicability.Applicable, [
      textNode('text', Applicability.Applicable),
    ]),
    node('IV', Applicability.Applicable, [
      textNode('text', Applicability.Applicable),
    ]),
    node('V', Applicability.Applicable, [
      node('1', Applicability.Applicable, [
        node('a', Applicability.Applicable, [
          textNode('text'),
        ]),
        node('b', Applicability.Applicable, [
          textNode('text'),
        ]),
      ]),
      node('2', Applicability.Applicable, [
        node('a', Applicability.Applicable, [
          textNode('text'),
          textNode('text'),
        ]),
        node('b', Applicability.Applicable, [
          textNode('text'),
          textNode('text'),
        ]),
      ]),
    ]),
    node('VI', Applicability.Applicable, [
      textNode('text', Applicability.Applicable),
    ]),
    leafNode('VII', Applicability.NotSpecified),
    leafNode('VIII', Applicability.Applicable),
    node('IX', Applicability.Applicable, [
      textNode('text', Applicability.Applicable)
    ])
  ]),
  node('B', Applicability.NotApplicable, [
    node('I', Applicability.Applicable, [
      textNode('text', Applicability.Applicable)
    ]),
    node('II', Applicability.NotApplicable, [
      textNode('text'),
      node('1', Applicability.Applicable, [
        textNode('text'),
        textNode('text', Applicability.Applicable),
      ]),
      node('2', Applicability.NotApplicable, [
        textNode('text', Applicability.NotApplicable),
        textNode('text'),
        textNode('text'),
      ])
    ]),
    leafNode('III', Applicability.NotApplicable),
    node('IV', Applicability.NotApplicable, [
      textNode('text'),
    ])
  ]),
  node('C', Applicability.NotSpecified, [
    textNode('text', Applicability.Applicable),
    textNode('text', Applicability.NotApplicable),
    textNode('text')
  ])
];

describe('docxFileReader', () => {
  test('should parse lines', () => {
    const parsed = readDocument(inputLines);

    expect(parsed).toEqual(awaitedResult);
  });
});
