// Roman numerals

const roman: { [key: string]: number } = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1
};

export function convertToRoman(num: number): string {
  return Object.entries(roman)
    .map(([i, value]) => {
      const q = Math.floor(num / value);
      num -= q * value;
      return i.repeat(q);
    })
    .join('');
}

// Character

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
