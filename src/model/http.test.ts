import { describe, expect, test } from 'vitest';

import { WebResponseError, WebResponseSuccess } from './http.js';

describe('The WebResponseSuccess Model', () => {
  test('should instantiate a WebResponseSuccess instance', () => {
    expect(
      new WebResponseSuccess({
        note: {
          noteId: 'id-note-1',
        },
      }),
    ).toStrictEqual(
      new WebResponseSuccess({
        note: {
          noteId: 'id-note-1',
        },
      }),
    );
  });
});

describe('The WebResponseError Model', () => {
  test('should instantiate a WebResponseError instance', () => {
    expect(
      new WebResponseError({
        title: 'Not Found',
        status: 404,
        detail: 'Note is not found',
        errors: {},
      }),
    ).toStrictEqual(
      new WebResponseError({
        title: 'Not Found',
        status: 404,
        detail: 'Note is not found',
        errors: {},
      }),
    );
  });
});
