import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import jsonDocStrToText from '@/common/helper/jsonDocStrToText.js';
import prismaClient from '@/common/lib/prismaClient.js';
import NoteEntity from '@/domain/note/entity/note.js';
import NoteRepositoryImpl from './noteRepositoryImpl.js';

import NotFoundError from '@/common/exception/notFoundError.js';
import { resetTables, seedTables } from '~/test/integration/helper/database.js';

beforeEach(async () => {
  await seedTables();
});

afterEach(async () => {
  await resetTables();
});

afterAll(async () => {
  await prismaClient.$disconnect();
});

describe('The NoteRepositoryImpl Repository Implementation', () => {
  describe('The getMany Method', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 0, 15));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test.for([
      {
        filters: {
          contains: 'note 1',
        },
        expected: [
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
        ],
      },
      {
        filters: {
          isActive: true,
        },
        expected: [
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
            id: '10000000-0000-0000-0000-000000000002',
            title: 'Title Note 2 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 2),
            updatedAt: new Date(2026, 0, 2),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
          new NoteEntity({
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
        ],
      },
      {
        filters: {
          isArchived: true,
        },
        expected: [
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
            id: '10000000-0000-0000-0000-000000000005',
            title: 'Title Note 5 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 5),
            updatedAt: new Date(2026, 0, 5),
            archivedAt: new Date(2026, 0, 5),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
          new NoteEntity({
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
        ],
      },
      {
        filters: {
          isTrashed: true,
        },
        expected: [
          new NoteEntity({
            id: '10000000-0000-0000-0000-000000000008',
            title: 'Title Note 8 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 8),
            updatedAt: new Date(2026, 0, 8),
            archivedAt: null,
            trashedAt: new Date(2026, 0, 8),
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
        ],
      },
      {
        filters: {
          contains: 'note 1',
          isActive: true,
          isArchived: true,
        },
        expected: [
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
        ],
      },
      {
        filters: {
          contains: 'note',
          isActive: true,
          isArchived: true,
        },
        expected: [
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
            id: '10000000-0000-0000-0000-000000000002',
            title: 'Title Note 2 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 2),
            updatedAt: new Date(2026, 0, 2),
            archivedAt: null,
            trashedAt: null,
            authorId: 'id-user-1',
          }),
          new NoteEntity({
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
            id: '10000000-0000-0000-0000-000000000005',
            title: 'Title Note 5 (Foo)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo)"}]}]}',
            createdAt: new Date(2026, 0, 5),
            updatedAt: new Date(2026, 0, 5),
            archivedAt: new Date(2026, 0, 5),
            trashedAt: null,
            authorId: 'id-user-1',
          }),
          new NoteEntity({
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
        ],
      },
      {
        filters: {
          contains: 'unknown note',
          isActive: true,
          isArchived: true,
        },
        expected: [],
      },
    ])(
      'should return all filtered user notes',
      async ({ filters, expected }) => {
        // Arrange
        const repository = new NoteRepositoryImpl(prismaClient);

        // Action & Assert
        await expect(
          repository.getMany('id-user-1', filters),
        ).resolves.toStrictEqual(expected);
      },
    );

    test('should return all user notes without filters', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action & Assert
      await expect(repository.getMany('id-user-1')).resolves.toStrictEqual([
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
          id: '10000000-0000-0000-0000-000000000002',
          title: 'Title Note 2 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo)"}]}]}',
          createdAt: new Date(2026, 0, 2),
          updatedAt: new Date(2026, 0, 2),
          archivedAt: null,
          trashedAt: null,
          authorId: 'id-user-1',
        }),
        new NoteEntity({
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
          id: '10000000-0000-0000-0000-000000000005',
          title: 'Title Note 5 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo)"}]}]}',
          createdAt: new Date(2026, 0, 5),
          updatedAt: new Date(2026, 0, 5),
          archivedAt: new Date(2026, 0, 5),
          trashedAt: null,
          authorId: 'id-user-1',
        }),
        new NoteEntity({
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
        new NoteEntity({
          id: '10000000-0000-0000-0000-000000000008',
          title: 'Title Note 8 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo)"}]}]}',
          createdAt: new Date(2026, 0, 8),
          updatedAt: new Date(2026, 0, 8),
          archivedAt: null,
          trashedAt: new Date(2026, 0, 8),
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
    });
  });

  describe('The getById Method', () => {
    describe('Failed Scenarios', () => {
      test('should throw an error when the user note is not found', async () => {
        // Arrange
        const repository = new NoteRepositoryImpl(prismaClient);

        // Action & Assert
        await expect(
          repository.getById(
            'id-user-1',
            '10000000-0000-0000-0000-000000000100',
          ),
        ).rejects.toThrow(
          new NotFoundError('Resource Not Found', 'Note is not found.'),
        );
      });
    });

    test('should return a user note by the note ID', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action & Assert
      await expect(
        repository.getById('id-user-1', '10000000-0000-0000-0000-000000000009'),
      ).resolves.toStrictEqual(
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
      );
    });
  });

  describe('The insert Method', () => {
    test('should insert a user new note', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action
      await repository.insert({
        userId: 'id-user-1',
        title: 'New Title Note 10',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        textContent: jsonDocStrToText(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        ),
      });

      // Assert
      const allUserNotes = await prismaClient.note.findMany({
        where: { authorId: 'id-user-1' },
      });

      expect(allUserNotes).toHaveLength(10);
    });
  });

  describe('The updateById Method', () => {
    describe('Failed Scenarios', () => {
      test('should throw an error when updating a non-existent user note', async () => {
        // Arrange
        const repository = new NoteRepositoryImpl(prismaClient);

        // Action & Assert
        await expect(() =>
          repository.updateById({
            noteId: '10000000-0000-0000-0000-000000000010',
            payload: {
              title: 'Updated Title Note 1 (Foo)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
              textContent: jsonDocStrToText(
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
              ),
              updatedAt: new Date(2026, 0, 15),
              archivedAt: new Date(2026, 0, 15),
              trashedAt: new Date(2026, 0, 15),
            },
          }),
        ).rejects.toThrow(NotFoundError);
      });
    });

    test('should update a user note', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action
      await repository.updateById({
        noteId: '10000000-0000-0000-0000-000000000001',
        payload: {
          title: 'Updated Title Note 1 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
          textContent: jsonDocStrToText(
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
          ),
          updatedAt: new Date(2026, 0, 15),
          archivedAt: new Date(2026, 0, 15),
          trashedAt: new Date(2026, 0, 15),
        },
      });

      // Assert
      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toEqual({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Updated Title Note 1 (Foo)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
        textContent: jsonDocStrToText(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo)"}]}]}',
        ),
        createdAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 0, 15),
        archivedAt: new Date(2026, 0, 15),
        trashedAt: new Date(2026, 0, 15),
        authorId: 'id-user-1',
      });
    });
  });

  describe('The deleteMany Method', () => {
    test('should delete all user notes that is in the trash', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action
      await repository.deleteMany('id-user-1');

      // Assert
      const userNotes = await prismaClient.note.findMany({
        where: { authorId: 'id-user-1' },
      });

      expect(userNotes).toHaveLength(6);
    });
  });

  describe('The deleteById Method', () => {
    test('should not delete the user note that is not in the trash', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action
      await repository.deleteById(
        'id-user-1',
        '10000000-0000-0000-0000-000000000001',
      );

      // Assert
      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).not.toBeNull();
    });

    test('should delete the user note that is in the trash', async () => {
      // Arrange
      const repository = new NoteRepositoryImpl(prismaClient);

      // Action
      await repository.deleteById(
        'id-user-1',
        '10000000-0000-0000-0000-000000000009',
      );

      // Assert
      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000009' },
      });

      expect(updatedNote).toBeNull();
    });
  });
});
