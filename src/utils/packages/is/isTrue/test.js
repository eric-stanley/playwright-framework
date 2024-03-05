import { test, expect } from '@playwright/test';

const isTrue = require('./isTrue');

test.describe('is/isTrue', () => {
  test('checks if a valud is true', () => {
    expect(isTrue(true)).toBe(true);

    expect(isTrue(false)).toBe(false);

    expect(isTrue()).toBe(false);
  });
});
