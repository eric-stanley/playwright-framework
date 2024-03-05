import { test, expect } from '@playwright/test';

const isFiniteNum = require('./isFiniteNum');

test.describe('is/isFiniteNum', () => {
  const runTests = () => {
    expect(isFiniteNum(Infinity)).toBe(false);

    expect(isFiniteNum(-Infinity)).toBe(false);

    expect(isFiniteNum(NaN)).toBe(false);

    expect(isFiniteNum(0)).toBe(true);

    expect(isFiniteNum('0')).toBe(false);

    expect(isFiniteNum(null)).toBe(false);

    expect(isFiniteNum(undefined)).toBe(false);

    expect(isFiniteNum(2e64)).toBe(true);
  };

  test('checks if a value is finite (Number.isFinite is supported)', () => {
    runTests();
  });

  test('checks if a value is finite (Number.isFinite is not supported)', () => {
    const nativeCode = Number.isFinite;
    Number.isFinite = null;
    runTests();
    Number.isFinite = nativeCode;
  });
});
