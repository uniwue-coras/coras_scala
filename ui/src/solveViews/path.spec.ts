import {CommonPathStartResult, findCommonPathStart} from './path';

describe('path', () => {

  test.each<[number[], number[], CommonPathStartResult]>([
    [[], [], {commonPathStart: [], remainingSamplePath: [], remainingUserPath: []}],
    [[1], [1], {commonPathStart: [1], remainingSamplePath: [], remainingUserPath: []}],
    [[1, 1], [1, 2], {commonPathStart: [1], remainingSamplePath: [1], remainingUserPath: [2]}]
  ])(
    'should find a common path start between %j and %j as %j',
    (samplePath, userPath, expected) => expect(findCommonPathStart(samplePath, userPath)).toEqual(expected)
  );

});
