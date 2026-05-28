import { expect, test } from 'vitest';

import sum from '@/test/example/sum.js';

test('should return 4 when 2 + 2', () => {
  expect(sum(2, 2)).toBe(4);
});
