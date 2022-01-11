import {analyzeParagraphs} from './paragraphExtractor';
import {ParagraphCitationInput, ParagraphType} from '../../graphql';

describe('analyzer', () => {

  const bavarianCases: [string, ParagraphCitationInput[]][] = [
    ['Art. 49', [{paragraphType: ParagraphType.Bavarian, startIndex: 0, endIndex: 7, paragraph: 49}]],
    ['Art. 49 4', [{paragraphType: ParagraphType.Bavarian, startIndex: 0, endIndex: 9, paragraph: 49, subParagraph: 4}]],
    ['Art. 49 Abs. 4', [{paragraphType: ParagraphType.Bavarian, startIndex: 0, endIndex: 14, paragraph: 49, subParagraph: 4}]],
    ['Art. 88 VwGO', [{paragraphType: ParagraphType.Bavarian, startIndex: 0, endIndex: 12, paragraph: 88, lawCode: 'VwGO'}]]
  ];

  test.each(bavarianCases)(
    'it should analyze bavarian paragraph `%s` as %j',
    (toAnalyze, expected) => expect(analyzeParagraphs(toAnalyze)).toEqual(expected)
  );

  const germanCases: [string, ParagraphCitationInput[]][] = [
    ['§ 40 I 1 VwGO', [{paragraphType: ParagraphType.German, startIndex: 0, endIndex: 13, paragraph: 40, subParagraph: 1, sentence: 1, lawCode: 'VwGO'}]],
    ['§ 40 Abs. 1 S. 1', [{paragraphType: ParagraphType.German, startIndex: 0, endIndex: 16, paragraph: 40, subParagraph: 1, sentence: 1}]],
    ['§ 40 Abs. 1 Satz 1 VwGO', [{
      paragraphType: ParagraphType.German,
      startIndex: 0,
      endIndex: 23,
      paragraph: 40,
      subParagraph: 1,
      sentence: 1,
      lawCode: 'VwGO'
    }]],
    ['§ 40 I S. 1 VwGO', [{paragraphType: ParagraphType.German, startIndex: 0, endIndex: 16, paragraph: 40, subParagraph: 1, sentence: 1, lawCode: 'VwGO'}]]
  ];

  test.each(germanCases)(
    'it should analyze german paragraph `%s` as %j',
    (toAnalyze, expected) => expect(analyzeParagraphs(toAnalyze)).toEqual(expected)
  );

});
