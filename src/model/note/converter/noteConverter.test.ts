import { describe, expect, test } from 'vitest';

import NoteEntity from '@/domain/note/entity/note.js';
import { NoteDetailResponse, NoteSimpleResponse } from '../note.js';
import { noteDetailConverter, noteSimpleConverter } from './noteConverter.js';

describe('The noteConverter Converter Functions', () => {
  describe('The noteSimpleConverter Converter Function', () => {
    test('should convert a note entity into a note simple response', () => {
      expect(
        noteSimpleConverter(
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 1),
            updatedAt: new Date(2026, 0, 1),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        ),
      ).toStrictEqual(
        new NoteSimpleResponse({
          id: '10000000-0000-0000-0000-000000000001',
          title: 'Title Note 1 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo)"}]}]}',
          createdAt: new Date(2026, 0, 1),
          updatedAt: new Date(2026, 0, 1),
          authorId: 'id-user-1',
        }),
      );
    });
  });

  describe('The noteDetailConverter Converter Function', () => {
    test('should convert a note entity into a note detail response', () => {
      expect(
        noteDetailConverter(
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 9 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 9),
            updatedAt: new Date(2026, 0, 9),
            archivedAt: new Date(2026, 0, 9),
            trashedAt: new Date(2026, 0, 9),
            authorId: 'id-user-1',
          }),
        ),
      ).toStrictEqual(
        new NoteDetailResponse({
          id: '10000000-0000-0000-0000-000000000001',
          title: 'Title Note 9 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
          createdAt: new Date(2026, 0, 9),
          updatedAt: new Date(2026, 0, 9),
          archivedAt: new Date(2026, 0, 9),
          trashedAt: new Date(2026, 0, 9),
          authorId: 'id-user-1',
        }),
      );
    });
  });
});
