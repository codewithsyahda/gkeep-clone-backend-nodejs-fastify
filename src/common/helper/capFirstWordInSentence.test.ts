import { describe, expect, test } from 'vitest';

import capFirstWordInSentence from './capFirstWordInSentence.js';

describe('The capFirstWordInSentence Helper Function', () => {
  test.each([
    {
      text: 'foo',
      expected: 'Foo',
    },
    {
      text: 'my name is Foo.',
      expected: 'My name is Foo.',
    },
    {
      text: ' hello Foo! nice to meet you.',
      expected: 'Hello Foo! Nice to meet you.',
    },
  ])(
    'should capitalize the first word in every sentence',
    ({ text, expected }) => {
      expect(capFirstWordInSentence(text)).toBe(expected);
    },
  );
});
