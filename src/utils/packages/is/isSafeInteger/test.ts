import { test, expect } from '@playwright/test';

const isSafeInteger = require('./isSafeInteger');

test.describe('is/isSafeInteger', () => {
  const runTests = () => {
    expect(isSafeInteger(3)).toBe(true);

    expect(isSafeInteger(Math.pow(2, 53))).toBe(false);

    expect(isSafeInteger(-Math.pow(2, 53))).toBe(false);

    expect(isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);

    expect(isSafeInteger(NaN)).toBe(false);

    expect(isSafeInteger(Infinity)).toBe(false);

    expect(isSafeInteger('3')).toBe(false);

    expect(isSafeInteger(3.1)).toBe(false);

    expect(isSafeInteger(3.0)).toBe(true);
  };

  test('check if integer number is in the safe range (Number.isSafeInteger is supported)', () => {
    runTests();
  });

  test('check if integer number is in the safe range (Number.isSafeInteger is not supported)', () => {
    const nativeCode = Number.isSafeInteger;
    Number.isSafeInteger = null;
    runTests();
    Number.isSafeInteger = nativeCode;
  });
});
