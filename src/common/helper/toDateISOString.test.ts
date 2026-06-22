import { describe, expect, test } from 'vitest';

import toDateISOString from './toDateISOString.js';

describe('The toDateISOString Helper Function', () => {
  describe('Failed Scenarios', () => {
    test('should throw and error when the date string is invalid', () => {
      expect(() => toDateISOString('is invalid')).toThrow(
        new TypeError('Input is not a Date object or not a valid date-string'),
      );
    });
  });

  test.each([new Date(2026, 0, 1), '2025-12-31T17:00:00.000Z'])(
    'should return true when the date string is valid',
    (input) => {
      expect(() => toDateISOString(input)).not.toThrow(
        new TypeError('Input is not a Date object or not a valid date-string'),
      );
    },
  );
});
