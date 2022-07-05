import {partitionArray} from './flatSolutionNode';

const testFunc = (value: number) => value % 2 === 0;

describe('partitionArray', () => {
  it('should partition array', () => {

    expect(partitionArray([], testFunc)).toEqual([[], []]);

    expect(partitionArray([1, 2, 3, 4], testFunc)).toEqual([[2, 4], [1, 3]]);

  });
});
