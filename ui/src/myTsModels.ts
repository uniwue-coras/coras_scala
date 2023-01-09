// DO NOT EDIT: generated file by scala-tsi

export type DocxText = (INormalText | IHeading);

export interface IHeading {
  level: number;
  text: string;
  type: "Heading";
}

export interface INormalText {
  text: string;
  type: "NormalText";
}
