const values = new Map([
  ['I', 1],
  ['V', 5],
  ['X', 10],
  ['L', 50],
  ['C', 100],
  ['D', 500],
  ['M', 1000]
]);

export function romanToInt(str: string): number {
  let result = 0, current, previous = 0;

  for (const char of str.toUpperCase().split('').reverse()) {
    current = values.get(char);

    if (!current) {
      throw new Error(`Illegal character ${char} in roman numeral found!`);
    }

    if (current >= previous) {
      result += current;
    } else {
      result -= current;
    }
    previous = current;
  }

  return result;
}

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
