import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import MockDocumentSchema from '@/application/utility/documentSchema.mock.js';
import BadRequestError from '@/common/exception/badRequestError.js';
import jsonDocStrToText from '@/common/helper/jsonDocStrToText.js';
import NoteEntity from '@/domain/note/entity/note.js';
import MockNoteRepository from '@/domain/note/repository/noteRepository.mock.js';
import {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from '@/model/note/note.js';
import NoteUseCaseImpl from './noteUseCaseImpl.js';

describe('The NoteUseCaseImpl Use-Case Implementation', () => {
  describe('The getAll Method', () => {
    test.for([
      {
        filters: {},
        expected: {
          filters: {},
        },
      },
      {
        filters: {
          search: 'foobar',
        },
        expected: {
          filters: {
            contains: 'foobar',
          },
        },
      },
      {
        filters: {
          isActive: 'true' as const,
        },
        expected: {
          filters: {
            isActive: true,
          },
        },
      },
      {
        filters: {
          isArchived: 'true' as const,
        },
        expected: {
          filters: {
            isArchived: true,
          },
        },
      },
      {
        filters: {
          isTrashed: 'true' as const,
        },
        expected: {
          filters: {
            isTrashed: true,
          },
        },
      },
    ])(
      'should do the use case logic correctly',
      async ({ filters, expected }) => {
        // Arrange
        const noteRepository = new MockNoteRepository();

        noteRepository.getMany = vi.fn().mockResolvedValue([
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
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000004',
            title: 'Title Note 4 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 4),
            updatedAt: new Date(2026, 0, 4),
            archivedAt: new Date(2026, 0, 4),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000009',
            title: 'Title Note 9 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 9),
            updatedAt: new Date(2026, 0, 9),
            archivedAt: new Date(2026, 0, 9),
            trashedAt: new Date(2026, 0, 9),
            authorId: 'id-user-1',
          }),
        ]);

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository: noteRepository,
          documentSchema: new MockDocumentSchema(),
        });

        await expect(
          noteUseCase.getAll('id-user-1', filters),
        ).resolves.toStrictEqual({
          notes: {
            active: [
              new NoteSimpleResponse({
                id: '10000000-0000-0000-0000-000000000001',
                title: 'Title Note 1 (Foo)',
                jsonContent:
                  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo)"}]}]}',
                createdAt: new Date(2026, 0, 1),
                updatedAt: new Date(2026, 0, 1),
                authorId: 'id-user-1',
              }),
            ],
            archived: [
              new NoteSimpleResponse({
                id: '10000000-0000-0000-0000-000000000004',
                title: 'Title Note 4 (Foo)',
                jsonContent:
                  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo)"}]}]}',
                createdAt: new Date(2026, 0, 4),
                updatedAt: new Date(2026, 0, 4),
                authorId: 'id-user-1',
              }),
            ],
            trash: [
              new NoteSimpleResponse({
                id: '10000000-0000-0000-0000-000000000009',
                title: 'Title Note 9 (Foo)',
                jsonContent:
                  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
                createdAt: new Date(2026, 0, 9),
                updatedAt: new Date(2026, 0, 9),
                authorId: 'id-user-1',
              }),
            ],
          },
        });

        expect(noteRepository.getMany).toHaveBeenCalledWith(
          'id-user-1',
          expected.filters,
        );
      },
    );
  });

  describe('The getById Method', () => {
    test.for([
      {
        noteId: '10000000-0000-0000-0000-000000000003',
        mockResolvedValue: {
          getById: new NoteEntity({
            id: '10000000-0000-0000-0000-000000000003',
            title: 'Title Note 3 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 3),
            updatedAt: new Date(2026, 0, 3),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        },
        expected: {
          noteId: '10000000-0000-0000-0000-000000000003',
          result: {
            note: new NoteDetailResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              archivedAt: null,
              trashedAt: null,
              authorId: 'id-user-1',
            }),
          },
        },
      },
      {
        noteId: '10000000-0000-0000-0000-000000000006',
        mockResolvedValue: {
          getById: new NoteEntity({
            id: '10000000-0000-0000-0000-000000000006',
            title: 'Title Note 6 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 6),
            updatedAt: new Date(2026, 0, 6),
            archivedAt: new Date(2026, 0, 6),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        },
        expected: {
          noteId: '10000000-0000-0000-0000-000000000006',
          result: {
            note: new NoteDetailResponse({
              id: '10000000-0000-0000-0000-000000000006',
              title: 'Title Note 6 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 6),
              updatedAt: new Date(2026, 0, 6),
              archivedAt: new Date(2026, 0, 6),
              trashedAt: null,
              authorId: 'id-user-1',
            }),
          },
        },
      },
      {
        noteId: '10000000-0000-0000-0000-000000000009',
        mockResolvedValue: {
          getById: new NoteEntity({
            id: '10000000-0000-0000-0000-000000000009',
            title: 'Title Note 9 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 9),
            updatedAt: new Date(2026, 0, 9),
            archivedAt: new Date(2026, 0, 9),
            trashedAt: new Date(2026, 0, 9),
            authorId: 'id-user-1',
          }),
        },
        expected: {
          noteId: '10000000-0000-0000-0000-000000000009',
          result: {
            note: new NoteDetailResponse({
              id: '10000000-0000-0000-0000-000000000009',
              title: 'Title Note 9 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 9),
              updatedAt: new Date(2026, 0, 9),
              archivedAt: new Date(2026, 0, 9),
              trashedAt: new Date(2026, 0, 9),
              authorId: 'id-user-1',
            }),
          },
        },
      },
    ])(
      'should do the use case logic correctly',
      async ({ noteId, mockResolvedValue, expected }) => {
        // Arrange
        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi
          .fn()
          .mockResolvedValue(mockResolvedValue.getById);

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema: new MockDocumentSchema(),
        });

        // Action & Assert
        await expect(
          noteUseCase.getById('id-user-1', noteId),
        ).resolves.toStrictEqual(expected.result);

        expect(noteRepository.getById).toHaveBeenCalledWith(
          'id-user-1',
          expected.noteId,
        );
      },
    );
  });

  describe('The create Method', () => {
    describe('Failed Scenarios', () => {
      test('should handle a throw error when converting a JSON document to text', async () => {
        // Arrange
        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi.fn().mockThrow(new Error());

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository: new MockNoteRepository(),
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.create(
            'id-user-1',
            new CreateNoteRequest('Title Note 10 (Foo)', '{invalid}'),
          ),
        ).rejects.toThrow(
          new BadRequestError({
            title: 'Body Request Validation Error',
            message: 'One or more body request fields are invalid.',
            errors: [
              {
                field: 'jsonContent',
                message: 'Must be a valid JSON document schema',
              },
            ],
          }),
        );

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{invalid}',
        );
      });
    });

    test.for([
      {
        payload: {
          title: '',
        },
        mockResolvedValue: {
          title: 'Untitled',
        },
        expected: {
          title: 'Untitled',
        },
      },
      {
        payload: {
          title: 'Title Note 10 (Foo)',
        },
        mockResolvedValue: {
          title: 'Title Note 10 (Foo)',
        },
        expected: {
          title: 'Title Note 10 (Foo)',
        },
      },
    ])(
      'should do the use case logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        const noteRepository = new MockNoteRepository();

        noteRepository.insert = vi.fn().mockResolvedValue(
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000010',
            title: mockResolvedValue.title,
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.create(
            'id-user-1',
            new CreateNoteRequest(
              payload.title,
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            ),
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000010',
            title: expected.title,
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(noteRepository.insert).toHaveBeenCalledWith({
          userId: 'id-user-1',
          title: expected.title,
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
          textContent: jsonDocStrToText(
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
          ),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );
      },
    );
  });

  describe('The updateById Method', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Failed Scenarios', () => {
      test('should handle a throw error when converting a JSON document to text', async () => {
        // Arrange
        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
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
        );

        noteRepository.updateById = vi.fn();

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi.fn().mockThrow(new Error());

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000001',
            new UpdateNoteRequest({
              title: 'Updated Title Note 1 (Foo)',
              jsonContent: '{invalid}',
              status: 'active',
              isTrashed: false,
            }),
          ),
        ).rejects.toThrow(
          new BadRequestError({
            title: 'Body Request Validation Error',
            message: 'One or more body request fields are invalid.',
            errors: [
              {
                field: 'jsonContent',
                message: 'Must be a valid JSON document schema',
              },
            ],
          }),
        );

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{invalid}',
        );

        expect(noteRepository.updateById).not.toHaveBeenCalled();
      });
    });

    test.for([
      {
        payload: {
          title: 'Updated Title Note 10 (Foo)',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteUseCase.updateById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          title: 'Title Note 10 (Foo)',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
        },
        expected: {
          'noteUseCase.updateById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
      {
        payload: {
          title: '',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
        },
        expected: {
          'noteUseCase.updateById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
    ])(
      'should handle updating the note title logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            new UpdateNoteRequest({
              title: payload.title,
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
              status: 'active',
              isTrashed: false,
            }),
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            ...expected['noteUseCase.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            textContent: 'Content note 10 (Foo)',
            archivedAt: null,
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteUseCase.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
          'documentSchema.jsonDocStrToText':
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
        },
        expected: {
          'noteUseCase.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'documentSchema.jsonDocStrToText':
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
    ])(
      'should handle updating the note jsonContent logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            new UpdateNoteRequest({
              title: 'Title Note 10 (Foo)',
              jsonContent: payload.jsonContent,
              status: 'active',
              isTrashed: false,
            }),
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            ...expected['noteUseCase.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          expected['documentSchema.jsonDocStrToText'],
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            archivedAt: null,
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          status: 'archived' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: null,
          },
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          status: 'archived' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12).toISOString(),
          },
        },
      },
      {
        payload: {
          status: 'active' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
      },
      {
        payload: {
          status: 'active' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: null,
          },
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
      },
    ])(
      'should handle updating with the status payload field logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            new UpdateNoteRequest({
              ...payload,
              title: 'Title Note 10 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
              isTrashed: false,
            }),
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          isTrashed: true,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: null,
          },
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          isTrashed: true,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12).toISOString(),
          },
        },
      },
      {
        payload: {
          isTrashed: false,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
      },
      {
        payload: {
          isTrashed: false,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: null,
          },
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
      },
    ])(
      'should handle updating with the isTrashed payload field logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            archivedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            archivedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            new UpdateNoteRequest({
              ...payload,
              title: 'Title Note 10 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
              status: 'active',
            }),
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
            archivedAt: null,
          },
        });
      },
    );
  });

  describe('The patchById Method', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Failed Scenarios', () => {
      test('should handle a throw error when body request fields are empty', async () => {
        // Arrange
        const noteUseCase = new NoteUseCaseImpl({
          noteRepository: new MockNoteRepository(),
          documentSchema: new MockDocumentSchema(),
        });

        await expect(() =>
          noteUseCase.patchById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000001',
            {},
          ),
        ).rejects.toThrow(
          new BadRequestError({
            title: 'Body Request Validation Error',
            message: 'Must have at least one body request field',
            errors: [],
          }),
        );
      });

      test('should handle a throw error when converting a JSON document to text', async () => {
        // Arrange
        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
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
        );

        noteRepository.updateById = vi.fn();

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi.fn().mockThrow(new Error());

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.updateById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000001',
            new UpdateNoteRequest({
              title: 'Updated Title Note 1 (Foo)',
              jsonContent: '{invalid}',
              status: 'active',
              isTrashed: false,
            }),
          ),
        ).rejects.toThrow(
          new BadRequestError({
            title: 'Body Request Validation Error',
            message: 'One or more body request fields are invalid.',
            errors: [
              {
                field: 'jsonContent',
                message: 'Must be a valid JSON document schema',
              },
            ],
          }),
        );

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{invalid}',
        );

        expect(noteRepository.updateById).not.toHaveBeenCalled();
      });
    });

    test.for([
      {
        payload: {
          title: 'Updated Title Note 10 (Foo)',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteUseCase.patchById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            title: 'Updated Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          title: 'Title Note 10 (Foo)',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
        },
        expected: {
          'noteUseCase.patchById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Title Note 10 (Foo)',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
      {
        payload: {
          title: '',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
        },
        expected: {
          'noteUseCase.patchById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            title: 'Untitled',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
    ])(
      'should handle updating the note title logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.patchById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            payload,
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            ...expected['noteUseCase.patchById'],
            id: '10000000-0000-0000-0000-000000000010',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            textContent: 'Content note 10 (Foo)',
            archivedAt: null,
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteUseCase.patchById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
          'documentSchema.jsonDocStrToText':
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
        expected: {
          'noteUseCase.patchById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10),
          },
          'documentSchema.jsonDocStrToText':
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
          'noteRepository.updateById': {
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
          },
        },
      },
    ])(
      'should handle updating the note jsonContent logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.patchById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            payload,
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            ...expected['noteUseCase.patchById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            createdAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          expected['documentSchema.jsonDocStrToText'],
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            archivedAt: null,
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          status: 'archived' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: null,
          },
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          status: 'archived' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: new Date(2026, 0, 12).toISOString(),
          },
        },
      },
      {
        payload: {
          status: 'active' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
      },
      {
        payload: {
          status: 'active' as const,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            archivedAt: null,
          },
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            archivedAt: null,
          },
        },
      },
    ])(
      'should handle updating with the status payload field logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.patchById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            payload,
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
            trashedAt: null,
          },
        });
      },
    );

    test.for([
      {
        payload: {
          isTrashed: true,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: null,
          },
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
      },
      {
        payload: {
          isTrashed: true,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12),
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: new Date(2026, 0, 12).toISOString(),
          },
        },
      },
      {
        payload: {
          isTrashed: false,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: new Date(2026, 0, 12),
          },
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
      },
      {
        payload: {
          isTrashed: false,
        },
        mockResolvedValue: {
          'noteRepository.getById': {
            trashedAt: null,
          },
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
        expected: {
          'noteRepository.updateById': {
            trashedAt: null,
          },
        },
      },
    ])(
      'should handle updating with the isTrashed payload field logic correctly',
      async ({ payload, mockResolvedValue, expected }) => {
        // Arrange
        vi.setSystemTime(new Date(2026, 0, 12));

        const noteRepository = new MockNoteRepository();

        noteRepository.getById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.getById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            archivedAt: null,
            authorId: 'id-user-1',
          }),
        );

        noteRepository.updateById = vi.fn().mockResolvedValue(
          new NoteEntity({
            ...mockResolvedValue['noteRepository.updateById'],
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            archivedAt: null,
            authorId: 'id-user-1',
          }),
        );

        const documentSchema = new MockDocumentSchema();

        documentSchema.jsonDocStrToText = vi
          .fn()
          .mockReturnValue('Content note 10 (Foo)');

        const noteUseCase = new NoteUseCaseImpl({
          noteRepository,
          documentSchema,
        });

        // Action & Assert
        await expect(
          noteUseCase.patchById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000010',
            payload,
          ),
        ).resolves.toStrictEqual({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000010',
            title: 'Title Note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 10),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        expect(documentSchema.jsonDocStrToText).toHaveBeenCalledWith(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        );

        expect(noteRepository.updateById).toHaveBeenCalledWith({
          noteId: '10000000-0000-0000-0000-000000000010',
          payload: {
            ...expected['noteRepository.updateById'],
            title: 'Title Note 10 (Foo)',
            textContent: 'Content note 10 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
            updatedAt: new Date(2026, 0, 10).toISOString(),
            archivedAt: null,
          },
        });
      },
    );
  });

  describe('The deleteAll Method', () => {
    test('should do the use case logic correctly', async () => {
      // Arrange
      const noteRepository = new MockNoteRepository();

      noteRepository.deleteMany = vi.fn().mockResolvedValue(undefined);

      const noteUseCase = new NoteUseCaseImpl({
        noteRepository,
        documentSchema: new MockDocumentSchema(),
      });

      // Action & Assert
      await expect(noteUseCase.deleteAll('id-user-1')).resolves.toBeUndefined();

      expect(noteRepository.deleteMany).toHaveBeenCalledWith('id-user-1');
    });
  });

  describe('The deleteById Method', () => {
    test('should do the use case logic correctly', async () => {
      // Arrange
      const noteRepository = new MockNoteRepository();

      noteRepository.deleteById = vi.fn().mockResolvedValue(undefined);

      const noteUseCase = new NoteUseCaseImpl({
        noteRepository,
        documentSchema: new MockDocumentSchema(),
      });

      // Action & Assert
      await expect(
        noteUseCase.deleteById(
          'id-user-1',
          '10000000-0000-0000-0000-000000000001',
        ),
      ).resolves.toBeUndefined();

      expect(noteRepository.deleteById).toHaveBeenCalledWith(
        'id-user-1',
        '10000000-0000-0000-0000-000000000001',
      );
    });
  });
});
