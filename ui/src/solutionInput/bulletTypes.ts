import {convertToRoman} from '../model/romanNumerals';

const a = 'a'.charCodeAt(0);
const A = 'A'.charCodeAt(0);

function convertToUpperBullet(index: number): string {
  return String.fromCharCode(A + index);
}

function convertToLowerBullet(index: number): string {
  return String.fromCharCode(a + index);
}

export function getBullet(depth: number, zeroIndex: number): string {
  if (depth === 0) {
    return convertToUpperBullet(zeroIndex);
  } else if (depth === 1) {
    return convertToRoman(zeroIndex + 1);
  } else if (depth === 3) {
    return convertToLowerBullet(zeroIndex);
  } else {
    return (zeroIndex + 1).toString();
  }
}
