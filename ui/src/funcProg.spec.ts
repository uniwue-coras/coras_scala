import {dropWhile, takeWhile} from './funcProg';

const testFunc = (n: number): boolean => n <= 2;

interface TestData<T> {
  input: number[];
  output: T;
}

describe('takeWhile', () => {
  test.each<TestData<[number[], number[]]>>([
    {input: [], output: [[], []]},
    {input: [1, 2], output: [[1, 2], []]},
    {input: [1, 2, 3, 4], output: [[1, 2], [3, 4]]}
  ])(
    'should take from $input while less than 2 with result $output.0 and remaining $output.1',
    ({input, output}) => expect(takeWhile(input, testFunc)).toEqual(output)
  );
});

describe('dropWhile', () => {
  test.each<TestData<number[]>>([
    {input: [], output: []},
    {input: [1, 2], output: []},
    {input: [1, 2, 3, 4], output: [3, 4]}
  ])(
    'should drop from $input while less than 2 with result $output',
    ({input, output}) => expect(dropWhile(input, testFunc)).toEqual(output)
  );
});
