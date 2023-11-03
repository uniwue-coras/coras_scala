// DO NOT EDIT: generated file by scala-tsi

export interface IDocxText {
  text: string;
  level?: number;
  extractedParagraphs: IParagraphCitation[];
}

export interface IParagraphCitation {
  from: number;
  to: number;
  paragraphType: string;
  lawCode: string;
  mentionedParagraphs: { [ key: string ]: string[]; };
}
