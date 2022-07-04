export function pathStartAndEnd(path: number[]): [number[], number] {
  return [
    path.slice(0, path.length - 1),
    path[path.length - 1]
  ];
}

export interface CommonPathStartResult {
  commonPathStart: number[];
  remainingSamplePath: number[];
  remainingUserPath: number[];
}

export function findCommonPathStart(samplePath: number[], userPath: number[]): CommonPathStartResult {
  const commonPathStart: number[] = [];

  let index = 0;

  while (index < samplePath.length && index < userPath.length && samplePath[index] === userPath[index]) {
    commonPathStart.push(samplePath[index]);
    index++;
  }

  return {
    commonPathStart,
    remainingSamplePath: samplePath.slice(index),
    remainingUserPath: userPath.slice(index)
  };
}
