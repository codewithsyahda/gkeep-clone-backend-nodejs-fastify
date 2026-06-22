import { describe, expect, test } from 'vitest';

import NoteEntity from './note.js';

describe('The Note Entity', () => {
  describe('Failed Scenarios', () => {
    test.each([
      {
        createdAt: 'new Date()',
        updatedAt: new Date().toISOString(),
        archivedAt: new Date(),
        trashedAt: new Date().toISOString(),
      },
      {
        createdAt: new Date(),
        updatedAt: 'new Date().toISOString()',
        archivedAt: new Date(),
        trashedAt: new Date().toISOString(),
      },
      {
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
        archivedAt: 'new Date()',
        trashedAt: new Date().toISOString(),
      },
      {
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
        archivedAt: new Date(),
        trashedAt: 'new Date().toISOString()',
      },
    ])(
      'should throw an error when date fields are an invalid date or date-string',
      (dateFields) => {
        expect(
          () =>
            new NoteEntity({
              ...dateFields,
              id: '',
              title: '',
              jsonContent: '',
              authorId: '',
            }),
        ).toThrow();
      },
    );
  });

  test('should instantiate a NoteEntity instance', () => {
    expect(
      () =>
        new NoteEntity({
          id: '',
          title: '',
          jsonContent: '',
          createdAt: new Date(2026, 1, 1),
          updatedAt: new Date(2026, 1, 1).toISOString(),
          archivedAt: new Date(2026, 1, 1),
          trashedAt: new Date(2026, 1, 1).toISOString(),
          authorId: '',
        }),
    ).not.toThrow();

    expect(
      new NoteEntity({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        archivedAt: new Date(2026, 1, 1),
        trashedAt: new Date(2026, 1, 1).toISOString(),
        authorId: '',
      }),
    ).toStrictEqual(
      new NoteEntity({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1).toISOString(),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        archivedAt: new Date(2026, 1, 1).toISOString(),
        trashedAt: new Date(2026, 1, 1).toISOString(),
        authorId: '',
      }),
    );

    expect(
      new NoteEntity({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        archivedAt: null,
        trashedAt: null,
        authorId: '',
      }),
    ).toStrictEqual(
      new NoteEntity({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1).toISOString(),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        archivedAt: null,
        trashedAt: null,
        authorId: '',
      }),
    );
  });
});
