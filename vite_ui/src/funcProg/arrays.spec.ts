import { dropWhile } from './array.extensions';

const testFunc = (n: number): boolean => n <= 2;

interface TestData<T> {
  input: number[];
  output: T;
}

describe('dropWhile', () => {
  test.each<TestData<number[]>>([
    { input: [], output: [] },
    { input: [1, 2], output: [] },
    { input: [1, 2, 3, 4], output: [3, 4] }
  ])(
    'should drop from $input while less than 2 with result $output',
    ({ input, output }) => expect(dropWhile(input, testFunc)).toEqual(output)
  );
});
