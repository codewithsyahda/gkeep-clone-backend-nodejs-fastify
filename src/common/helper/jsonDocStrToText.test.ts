import { describe, expect, test } from 'vitest';

import jsonDocStrToText from './jsonDocStrToText.js';

describe('The jsonStrDocToText Helper Function', () => {
  describe('Failed Scenarios', () => {
    test('should throw an error when the JSON document schema is invalid', () => {
      expect(() => jsonDocStrToText('invalid')).toThrow();
    });
  });

  test('should return text content after parsing the JSON document schema', () => {
    expect(
      jsonDocStrToText(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is a paragraph 1."}]},{"type":"paragraph","content":[{"type":"text","text":"This is a paragraph 2."}]}]}',
      ),
    ).toBe('This is a paragraph 1. This is a paragraph 2.');
  });
});
