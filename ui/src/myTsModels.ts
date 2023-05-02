// DO NOT EDIT: generated file by scala-tsi

export interface IDocxText {
  text: string;
  level?: number;
  extractedParagraphs: IParagraphExtraction[];
}

export interface IParagraphExtraction {
  from: number;
  to: number;
  paragraphType: string;
  lawCode: string;
  rest: string;
}
