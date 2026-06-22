import { describe, expect, test } from 'vitest';

import {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from './note.js';

describe('The NoteSimpleEntity Model', () => {
  describe('Failed Scenarios', () => {
    test.each([
      {
        createdAt: 'new Date()',
        updatedAt: new Date().toISOString(),
      },
      {
        createdAt: new Date(),
        updatedAt: 'new Date().toISOString()',
      },
    ])(
      'should throw an error when date fields are an invalid date or date-string',
      (dateFields) => {
        expect(
          () =>
            new NoteSimpleResponse({
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

  test('should instantiate a NoteSimpleResponse instance', () => {
    expect(
      new NoteSimpleResponse({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        authorId: '',
      }),
    ).toStrictEqual(
      new NoteSimpleResponse({
        id: '',
        title: '',
        jsonContent: '',
        createdAt: new Date(2026, 1, 1).toISOString(),
        updatedAt: new Date(2026, 1, 1).toISOString(),
        authorId: '',
      }),
    );
  });
});

describe('The NoteDetailResponse Model', () => {
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
            new NoteDetailResponse({
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

  test('should instantiate a NoteDetailResponse instance', () => {
    expect(
      () =>
        new NoteDetailResponse({
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
      new NoteDetailResponse({
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
      new NoteDetailResponse({
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
      new NoteDetailResponse({
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
      new NoteDetailResponse({
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

describe('The CreateNoteRequest Model', () => {
  test('should instantiate a CreateNoteRequest instance', () => {
    expect(
      new CreateNoteRequest(
        'Title Note',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note"}]}]}',
      ),
    ).toStrictEqual(
      new CreateNoteRequest(
        'Title Note',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note"}]}]}',
      ),
    );
  });
});

describe('The UpdateNoteRequest Model', () => {
  test('should instantiate a UpdateNoteRequest instance', () => {
    expect(
      new UpdateNoteRequest({
        title: 'Title Note',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note"}]}]}',
        status: 'active',
        isTrashed: false,
      }),
    ).toStrictEqual(
      new UpdateNoteRequest({
        title: 'Title Note',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note"}]}]}',
        status: 'active',
        isTrashed: false,
      }),
    );
  });
});
