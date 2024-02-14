import {IDocxText} from '../myTsModels';
import {readDocument} from './docxFileReader';
import {RawSolutionNode} from '../solutionInput/solutionEntryNode';
import {Applicability} from '../graphql';

const inputLines: IDocxText[] = [
  {level: 1, text: 'A (+)', extractedParagraphs: []},
  {level: 2, text: 'I (+)', extractedParagraphs: []},
  {level: 3, text: '1 (+)', extractedParagraphs: []},
  {level: 3, text: '2 (+)', extractedParagraphs: []},
  {level: 4, text: 'a (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 4, text: 'b (+)', extractedParagraphs: []},
  {level: 4, text: 'c (+)', extractedParagraphs: []},
  {level: 2, text: 'II (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '1 (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '2 (-)', extractedParagraphs: []},
  {text: 'text (-)', extractedParagraphs: []},
  {level: 3, text: '3 (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '4 (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '5 (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 2, text: 'III (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 2, text: 'IV (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 2, text: 'V (+)', extractedParagraphs: []},
  {level: 3, text: '1 (+)', extractedParagraphs: []},
  {level: 4, text: 'a (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 4, text: 'b (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '2 (+)', extractedParagraphs: []},
  {level: 4, text: 'a (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 4, text: 'b (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 2, text: 'VI (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 2, text: 'VII', extractedParagraphs: []},
  {level: 2, text: 'VIII (+)', extractedParagraphs: []},
  {level: 2, text: 'IX (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 1, text: 'B (-)', extractedParagraphs: []},
  {level: 2, text: 'I (+)', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 2, text: 'II (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 3, text: '1 (+)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {level: 3, text: '2 (-)', extractedParagraphs: []},
  {text: 'text (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 2, text: 'III (-)', extractedParagraphs: []},
  {level: 2, text: 'IV (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []},
  {level: 1, text: 'C', extractedParagraphs: []},
  {text: 'text (+)', extractedParagraphs: []},
  {text: 'text (-)', extractedParagraphs: []},
  {text: 'text', extractedParagraphs: []}
];

function node(text: string, applicability: Applicability, children: RawSolutionNode[]): RawSolutionNode {
  return {isSubText: false, text, applicability, children, extractedParagraphs: []};
}

function leafNode(text: string, applicability: Applicability): RawSolutionNode {
  return node(text, applicability, []);
}

function textNode(text: string, applicability = Applicability.NotSpecified): RawSolutionNode {
  return {isSubText: true, text, applicability, children: [], extractedParagraphs: []};
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
