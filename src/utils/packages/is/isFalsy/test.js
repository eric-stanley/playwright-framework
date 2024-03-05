import { test, expect } from '@playwright/test';

const isFalsy = require('./isFalsy');

test.describe('is/isFalsy', () => {
  test('checks if a value is falsy', () => {
    expect(isFalsy(true)).toBe(false);

    expect(isFalsy(' ')).toBe(false);

    expect(isFalsy({ foo: 'bar' })).toBe(false);

    expect(isFalsy(false)).toBe(true);

    expect(isFalsy(NaN)).toBe(true);

    expect(isFalsy()).toBe(true);

    expect(isFalsy(0)).toBe(true);

    expect(isFalsy(-0)).toBe(true);

    expect(isFalsy(BigInt(0))).toBe(true);

    expect(isFalsy('')).toBe(true);
  });
});
