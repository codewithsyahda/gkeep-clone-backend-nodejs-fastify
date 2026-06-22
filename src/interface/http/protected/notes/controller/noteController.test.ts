import Fastify from 'fastify';
import { describe, expect, test, vi } from 'vitest';

import MockNoteUseCase from '@/application/use-case/note/noteUseCase.mock.js';
import { WebResponseSuccess } from '@/model/http.js';
import {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from '@/model/note/note.js';
import { notesRoutesSchemas } from '../notesRoutesSchema.js';
import NoteControllerImpl from './notesControllerImpl.js';

describe('The NoteControllerImpl Controller Implementation', () => {
  describe('The getAll Route Handler', () => {
    test.for([
      {
        filters: {
          search: 'My note',
        },
        expected: {
          filters: {
            search: 'My note',
          },
        },
      },
      {
        filters: {
          is_active: 'true',
        },
        expected: {
          filters: {
            isActive: 'true',
          },
        },
      },
      {
        filters: {
          is_archived: 'true',
        },
        expected: {
          filters: {
            isArchived: 'true',
          },
        },
      },
      {
        filters: {
          is_trashed: 'true',
        },
        expected: {
          filters: {
            isTrashed: 'true',
          },
        },
      },
    ])(
      'should control the request correctly',
      async ({ filters, expected }) => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.getAll = vi.fn().mockResolvedValue({
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
                id: '10000000-0000-0000-0000-000000000008',
                title: 'Title Note 8 (Foo)',
                jsonContent:
                  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo)"}]}]}',
                createdAt: new Date(2026, 0, 8),
                updatedAt: new Date(2026, 0, 8),
                authorId: 'id-user-1',
              }),
            ],
          },
        });

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.get(
          '/notes',
          {
            schema: notesRoutesSchemas['/notes'].GET.schema,
          },
          controller.getAll,
        );

        // Action
        const response = await fastify.inject({
          method: 'GET',
          url: '/notes',
          query: {
            ...filters,
          },
        });

        // Assert
        expect(response.statusCode).toBe(200);

        expect(JSON.parse(response.body)).toEqual(
          new WebResponseSuccess({
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
                  id: '10000000-0000-0000-0000-000000000008',
                  title: 'Title Note 8 (Foo)',
                  jsonContent:
                    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo)"}]}]}',
                  createdAt: new Date(2026, 0, 8),
                  updatedAt: new Date(2026, 0, 8),
                  authorId: 'id-user-1',
                }),
              ],
            },
          }),
        );

        expect(noteUseCase.getAll).toHaveBeenCalledWith(
          'id-user-1',
          expected.filters,
        );
      },
    );

    describe('The create Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.create = vi.fn().mockResolvedValue({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000020',
            title: 'Title Note 20 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 20 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 20),
            updatedAt: new Date(2026, 0, 20),
            authorId: 'id-user-1',
          }),
        });

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.post(
          '/notes',
          {
            schema: notesRoutesSchemas['/notes'].POST.schema,
          },
          controller.create,
        );

        // Action
        const response = await fastify.inject({
          method: 'POST',
          url: '/notes',
          body: {
            title: 'Title Note 20 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 20 (Foo)"}]}]}',
          },
        });

        // Assert
        expect(response.statusCode).toBe(201);

        expect(JSON.parse(response.body)).toEqual(
          new WebResponseSuccess({
            note: new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000020',
              title: 'Title Note 20 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 20 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 20),
              updatedAt: new Date(2026, 0, 20),
              authorId: 'id-user-1',
            }),
          }),
        );

        expect(noteUseCase.create).toHaveBeenCalledWith(
          'id-user-1',
          new CreateNoteRequest(
            'Title Note 20 (Foo)',
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 20 (Foo)"}]}]}',
          ),
        );
      });
    });

    describe('The deleteAll Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.deleteAll = vi.fn().mockResolvedValue(undefined);

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.delete(
          '/notes',
          {
            schema: notesRoutesSchemas['/notes'].DELETE.schema,
          },
          controller.deleteAll,
        );

        // Action
        const response = await fastify.inject({
          method: 'DELETE',
          url: '/notes',
        });

        // Assert
        expect(response.statusCode).toBe(204);

        expect(noteUseCase.deleteAll).toHaveBeenCalledWith('id-user-1');
      });
    });

    describe('The getById Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.getById = vi.fn().mockResolvedValue({
          note: new NoteDetailResponse({
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
        });

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.get(
          '/notes/:noteId',
          {
            schema: notesRoutesSchemas['/notes/:noteId'].GET.schema,
          },
          controller.getById,
        );

        // Action
        const response = await fastify.inject({
          method: 'GET',
          url: `/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        });

        // Assert
        expect(response.statusCode).toBe(200);

        expect(JSON.parse(response.body)).toEqual(
          new WebResponseSuccess({
            note: new NoteDetailResponse({
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
          }),
        );

        expect(noteUseCase.getById).toHaveBeenCalledWith(
          'id-user-1',
          '10000000-0000-0000-0000-000000000001',
        );
      });
    });

    describe('The updateById Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.updateById = vi.fn().mockResolvedValue({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 1),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.put(
          '/notes/:noteId',
          {
            schema: notesRoutesSchemas['/notes/:noteId'].PUT.schema,
          },
          controller.updateById,
        );

        // Action
        const response = await fastify.inject({
          method: 'PUT',
          url: `/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
          body: {
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            status: 'archived',
            isTrashed: true,
          },
        });

        // Assert
        expect(response.statusCode).toBe(200);

        expect(JSON.parse(response.body)).toEqual(
          new WebResponseSuccess({
            note: new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Updated Title Note 1 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 10),
              authorId: 'id-user-1',
            }),
          }),
        );

        expect(noteUseCase.updateById).toHaveBeenCalledWith(
          'id-user-1',
          '10000000-0000-0000-0000-000000000001',
          new UpdateNoteRequest({
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            status: 'archived',
            isTrashed: true,
          }),
        );
      });
    });

    describe('The patchById Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.patchById = vi.fn().mockResolvedValue({
          note: new NoteSimpleResponse({
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 1),
            updatedAt: new Date(2026, 0, 10),
            authorId: 'id-user-1',
          }),
        });

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.patch(
          '/notes/:noteId',
          {
            schema: notesRoutesSchemas['/notes/:noteId'].PATCH.schema,
          },
          controller.patchById,
        );

        // Action
        const response = await fastify.inject({
          method: 'PATCH',
          url: `/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
          body: {
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            status: 'archived',
            isTrashed: true,
          },
        });

        // Assert
        expect(response.statusCode).toBe(200);

        expect(JSON.parse(response.body)).toEqual(
          new WebResponseSuccess({
            note: new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Updated Title Note 1 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 10),
              authorId: 'id-user-1',
            }),
          }),
        );

        expect(noteUseCase.patchById).toHaveBeenCalledWith(
          'id-user-1',
          '10000000-0000-0000-0000-000000000001',
          new UpdateNoteRequest({
            title: 'Updated Title Note 1 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
            status: 'archived',
            isTrashed: true,
          }),
        );
      });
    });

    describe('The deleteById Route Handler', () => {
      test('should control the request correctly', async () => {
        // Arrange
        const noteUseCase = new MockNoteUseCase();

        noteUseCase.deleteById = vi.fn().mockResolvedValue(undefined);

        const fastify = Fastify();

        fastify.decorateRequest('userId', 'id-user-1');

        const controller = new NoteControllerImpl(noteUseCase);

        fastify.delete(
          '/notes/:noteId',
          {
            schema: notesRoutesSchemas['/notes/:noteId'].DELETE.schema,
          },
          controller.deleteById,
        );

        // Action
        const response = await fastify.inject({
          method: 'DELETE',
          url: `/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        });

        // Assert
        expect(response.statusCode).toBe(204);

        expect(noteUseCase.deleteById).toHaveBeenCalledWith(
          'id-user-1',
          '10000000-0000-0000-0000-000000000001',
        );
      });
    });
  });
});
