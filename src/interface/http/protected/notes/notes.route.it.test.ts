import { request } from 'undici';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import envs from '@/common/config/envs.js';
import createFastify from '@/common/config/fastify.js';
import prismaClient from '@/common/lib/prismaClient.js';
import { NoteDetailResponse, NoteSimpleResponse } from '@/model/note/note.js';
import {
  getSessionCookieValue,
  getSessionUser,
  seedUsersWithEmail,
} from '~/test/integration/helper/auth.js';
import {
  resetTables,
  seedUsersNotes,
} from '~/test/integration/helper/database.js';

const fastify = createFastify();

beforeAll(async () => {
  await fastify.listen({
    host: '127.0.0.1',
    port: envs.server.port,
  });
});

beforeEach(async () => {
  const seedUsersResult = await seedUsersWithEmail();

  for (const each of seedUsersResult) {
    await seedUsersNotes([
      {
        userId: each.userId,
        name: each.name,
      },
    ]);
  }
});

afterEach(async () => {
  await resetTables();
});

afterAll(async () => {
  await fastify.close();
});

describe('The notesRoute Route Plugin', () => {
  describe('GET /notes', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 0, 15));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes`,
          {
            headers: new Headers(),
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });

      test('should return 400 when one or more query parameters are invalid', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
            }),
            query: {
              is_active: 'foobar',
              is_archived: 'foobar',
              is_trashed: 'foobar',
            },
          },
        );

        // Assert
        expect(response.statusCode).toBe(400);

        const resJson = await response.body.json();

        expect(resJson).toMatchObject({
          title: 'Query Parameters Validation Error',
          status: 400,
          detail: 'One or more query parameters are invalid.',
        });

        expect(resJson).toHaveProperty('errors');
      });
    });

    test.for([
      {
        filters: {},
        expected: {
          active: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 1),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000002',
              title: 'Title Note 2 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 2),
              updatedAt: new Date(2026, 0, 2),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              authorId: '',
            }),
          ],
          archived: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000004',
              title: 'Title Note 4 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 4),
              updatedAt: new Date(2026, 0, 4),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000005',
              title: 'Title Note 5 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 5),
              updatedAt: new Date(2026, 0, 5),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000006',
              title: 'Title Note 6 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 6),
              updatedAt: new Date(2026, 0, 6),
              authorId: '',
            }),
          ],
          trash: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000008',
              title: 'Title Note 8 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 8),
              updatedAt: new Date(2026, 0, 8),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000009',
              title: 'Title Note 9 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 9),
              updatedAt: new Date(2026, 0, 9),
              authorId: '',
            }),
          ],
        },
      },
      {
        filters: {
          is_active: 'true',
        },
        expected: {
          active: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 1),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000002',
              title: 'Title Note 2 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 2),
              updatedAt: new Date(2026, 0, 2),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              authorId: '',
            }),
          ],
          archived: [],
          trash: [],
        },
      },
      {
        filters: {
          is_archived: 'true',
        },
        expected: {
          active: [],
          archived: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000004',
              title: 'Title Note 4 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 4),
              updatedAt: new Date(2026, 0, 4),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000005',
              title: 'Title Note 5 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 5),
              updatedAt: new Date(2026, 0, 5),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000006',
              title: 'Title Note 6 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 6),
              updatedAt: new Date(2026, 0, 6),
              authorId: '',
            }),
          ],
          trash: [],
        },
      },
      {
        filters: {
          is_trashed: 'true',
        },
        expected: {
          active: [],
          archived: [],
          trash: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000008',
              title: 'Title Note 8 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 8),
              updatedAt: new Date(2026, 0, 8),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000009',
              title: 'Title Note 9 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 9),
              updatedAt: new Date(2026, 0, 9),
              authorId: '',
            }),
          ],
        },
      },
      {
        filters: {
          search: '',
          is_active: 'true',
          is_archived: 'true',
        },
        expected: {
          active: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 1),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000002',
              title: 'Title Note 2 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 2),
              updatedAt: new Date(2026, 0, 2),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              authorId: '',
            }),
          ],
          archived: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000004',
              title: 'Title Note 4 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 4),
              updatedAt: new Date(2026, 0, 4),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000005',
              title: 'Title Note 5 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 5),
              updatedAt: new Date(2026, 0, 5),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000006',
              title: 'Title Note 6 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 6),
              updatedAt: new Date(2026, 0, 6),
              authorId: '',
            }),
          ],
          trash: [],
        },
      },
      {
        filters: {
          search: 'fOo',
          is_active: 'true',
          is_archived: 'true',
        },
        expected: {
          active: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000001',
              title: 'Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 1),
              updatedAt: new Date(2026, 0, 1),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000002',
              title: 'Title Note 2 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 2 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 2),
              updatedAt: new Date(2026, 0, 2),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              authorId: '',
            }),
          ],
          archived: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000004',
              title: 'Title Note 4 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 4),
              updatedAt: new Date(2026, 0, 4),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000005',
              title: 'Title Note 5 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 5),
              updatedAt: new Date(2026, 0, 5),
              authorId: '',
            }),
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000006',
              title: 'Title Note 6 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 6 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 6),
              updatedAt: new Date(2026, 0, 6),
              authorId: '',
            }),
          ],
          trash: [],
        },
      },
      {
        filters: {
          search: '3',
          is_active: 'true',
          is_archived: 'true',
        },
        expected: {
          active: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000003',
              title: 'Title Note 3 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 3 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 3),
              updatedAt: new Date(2026, 0, 3),
              authorId: '',
            }),
          ],
          archived: [],
          trash: [],
        },
      },
      {
        filters: {
          search: '5',
          is_active: 'true',
          is_archived: 'true',
        },
        expected: {
          active: [],
          archived: [
            new NoteSimpleResponse({
              id: '10000000-0000-0000-0000-000000000005',
              title: 'Title Note 5 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
              createdAt: new Date(2026, 0, 5),
              updatedAt: new Date(2026, 0, 5),
              authorId: '',
            }),
          ],
          trash: [],
        },
      },
      {
        filters: {
          search: 'unknown',
          is_active: 'true',
          is_archived: 'true',
        },
        expected: {
          active: [],
          archived: [],
          trash: [],
        },
      },
    ])('should return all user notes', async ({ filters, expected }) => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
          }),
          query: {
            ...filters,
          },
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const sessionUser = await getSessionUser({
        email: 'foo@doe.com',
        password: '12345678',
      });

      expect(resJson).toEqual({
        data: {
          notes: {
            active: expected.active.map((e) => ({
              ...e,
              authorId: sessionUser.id,
            })),
            archived: expected.archived.map((e) => ({
              ...e,
              authorId: sessionUser.id,
            })),
            trash: expected.trash.map((e) => ({
              ...e,
              authorId: sessionUser.id,
            })),
          },
        },
      });
    });
  });

  describe('POST /notes', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes`,
          {
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              title: 'My Note',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note (Foo Doe)"}]}]}',
            }),
            method: 'POST',
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });

      test.for([
        {},
        {
          title: '',
        },
        {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo Doe)"}]}]}',
        },
        {
          title: 'New Title Note 10',
          jsonContent: 'invalid document JSON schema',
        },
        {
          title: [...new Array(129)].map(() => 'A').join(),
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo Doe)"}]}]}',
        },
      ])(
        'should return 400 when the body request is invalid',
        async (bodyRequest) => {
          // Arrange & Action
          const response = await request(
            `http://localhost:${envs.server.port}/api/v1/notes`,
            {
              method: 'POST',
              body: JSON.stringify(bodyRequest),
              headers: new Headers({
                Cookie: await getSessionCookieValue({
                  email: 'foo@doe.com',
                  password: '12345678',
                }),
                'Content-Type': 'application/json',
              }),
            },
          );

          // Assert
          expect(response.statusCode).toBe(400);

          const resJson = await response.body.json();

          expect(resJson).toMatchObject({
            title: 'Body Request Validation Error',
            status: 400,
          });

          expect(resJson).toHaveProperty('detail');
          expect(resJson).toHaveProperty('errors');
        },
      );
    });

    test.for([
      {
        payload: {
          title: 'Title Note 10 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
        expected: {
          title: 'Title Note 10 (Foo)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
      },
      {
        payload: {
          title: '',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
        expected: {
          title: 'Untitled',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 10 (Foo)"}]}]}',
        },
      },
    ])('should create a new user note', async ({ payload, expected }) => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
        },
      );

      // Assert
      expect(response.statusCode).toBe(201);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            title: expected.title,
            jsonContent: expected.jsonContent,
            authorId: userId,
          },
        },
      });

      expect(resJson).toHaveProperty('data.note.id');
      expect(resJson).toHaveProperty('data.note.createdAt');
      expect(resJson).toHaveProperty('data.note.updatedAt');

      await expect(
        prismaClient.note.findMany({
          where: {
            authorId: userId,
          },
        }),
      ).resolves.toHaveLength(10);
    });
  });

  describe('DELETE /notes', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes`,
          {
            method: 'DELETE',
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });
    });

    test('should delete all the user notes in the trash', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
          }),
          method: 'DELETE',
        },
      );

      // Assert
      expect(response.statusCode).toBe(204);

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      await expect(
        prismaClient.note.findMany({
          where: {
            trashedAt: null,
            authorId: userId,
          },
        }),
      ).resolves.toHaveLength(6);

      await expect(
        prismaClient.note.findMany({
          where: {
            trashedAt: { not: null },
            authorId: userId,
          },
        }),
      ).resolves.toHaveLength(0);
    });
  });

  describe('GET /notes/:noteId', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
          {
            headers: new Headers(),
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });

      test('should return 404 when fetching a non-existent user note ', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000100')}`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
            }),
          },
        );

        // Assert
        expect(response.statusCode).toBe(404);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Resource Not Found',
          status: 404,
          detail: 'Note is not found.',
          errors: {},
        });
      });
    });

    test('should return a user note by the note ID', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000009')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
          }),
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toEqual({
        data: {
          note: new NoteDetailResponse({
            id: '10000000-0000-0000-0000-000000000009',
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 9),
            updatedAt: new Date(2026, 0, 9),
            archivedAt: new Date(2026, 0, 9),
            trashedAt: new Date(2026, 0, 9),
            authorId: userId,
          }),
        },
      });
    });
  });

  describe('PUT /notes/:noteId', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
          {
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              title: 'Updated Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
              status: 'archived',
              isTrashed: true,
            }),
            method: 'PUT',
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });

      test.for([
        {},
        {
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          status: 'active',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          status: 'active',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          status: 'active',
        },
        {
          title: [...new Array(129).map(() => 'A')],
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          status: 'active',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          jsonContent: 'invalid',
          status: 'active',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          status: 'unknown',
          isTrashed: false,
        },
        {
          title: 'Updated Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          status: 'active',
          isTrashed: 'unknown',
        },
      ])(
        'should return 400 when the body request is invalid',
        async (bodyRequest) => {
          // Arrange & Action
          const response = await request(
            `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
            {
              headers: new Headers({
                Cookie: await getSessionCookieValue({
                  email: 'foo@doe.com',
                  password: '12345678',
                }),
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(bodyRequest),
              method: 'PUT',
            },
          );

          // Assert
          expect(response.statusCode).toBe(400);

          const resJson = await response.body.json();

          expect(resJson).toMatchObject({
            title: 'Body Request Validation Error',
            status: 400,
            detail: 'One or more body request fields are invalid.',
          });

          expect(resJson).toHaveProperty('errors');
        },
      );

      test('should return 404 when fetching a non-existent user note ', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000100')}`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              title: 'Updated Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
              status: 'archived',
              isTrashed: true,
            }),
            method: 'PUT',
          },
        );

        // Assert
        expect(response.statusCode).toBe(404);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Resource Not Found',
          status: 404,
          detail: 'Note is not found.',
          errors: {},
        });
      });
    });

    test.for([
      {
        titlePayload: '',
        expected: 'Untitled',
      },
      {
        titlePayload: 'Updated Note Title 1',
        expected: 'Updated Note Title 1',
      },
      {
        titlePayload: [...new Array(128).map(() => 'A')].join(),
        expected: [...new Array(128).map(() => 'A')].join(),
      },
    ])('should update the note title', async ({ titlePayload, expected }) => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: titlePayload,
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: expected,
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: expected,
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
      });
    });

    test('should update the note jsonContent', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
      });
    });

    test('should update an active note with an "archived" status payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            updatedAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 0, 1),
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        archivedAt: null,
      });
    });

    test('should update an archived note with an "active" status payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000005')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 5 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000005',
            title: 'Title Note 5 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 5).toISOString(),
            updatedAt: new Date(2026, 0, 5).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000005' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000005',
        title: 'Title Note 5 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 5),
        updatedAt: new Date(2026, 0, 5),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });
    });

    test('should update an active note with a Boolean true value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: true,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            updatedAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 0, 1),
        archivedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        trashedAt: null,
      });
    });

    test('should update an archived note with a Boolean true value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000004')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 4 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: true,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000004',
            title: 'Title Note 4 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 4).toISOString(),
            updatedAt: new Date(2026, 0, 4).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000004' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000004',
        title: 'Title Note 4 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 4),
        updatedAt: new Date(2026, 0, 4),
        archivedAt: new Date(2026, 0, 4),
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        trashedAt: null,
      });
    });

    test('should update a trashed active note with a Boolean false value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000007')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 7 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 7 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000007',
            title: 'Title Note 7 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 7 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 7).toISOString(),
            updatedAt: new Date(2026, 0, 7).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000007' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000007',
        title: 'Title Note 7 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 7 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 7),
        updatedAt: new Date(2026, 0, 7),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });
    });

    test('should update a trashed archived note with a Boolean false value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000009')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: false,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000009',
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 9).toISOString(),
            updatedAt: new Date(2026, 0, 9).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000009' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000009',
        title: 'Title Note 9 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 9),
        updatedAt: new Date(2026, 0, 9),
        archivedAt: new Date(2026, 0, 9),
        trashedAt: null,
        authorId: userId,
      });
    });

    test.for([
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000001',
          payload: {
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000001',
          title: 'Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 1),
          updatedAt: new Date(2026, 0, 1),
          archivedAt: null,
          trashedAt: null,
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000004',
          payload: {
            title: 'Title Note 4 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: false,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000004',
          title: 'Title Note 4 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 4),
          updatedAt: new Date(2026, 0, 4),
          archivedAt: new Date(2026, 0, 4),
          trashedAt: null,
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000008',
          payload: {
            title: 'Title Note 8 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: true,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000008',
          title: 'Title Note 8 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 8),
          updatedAt: new Date(2026, 0, 8),
          archivedAt: null,
          trashedAt: new Date(2026, 0, 8),
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000009',
          payload: {
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: true,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000009',
          title: 'Title Note 9 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 9),
          updatedAt: new Date(2026, 0, 9),
          archivedAt: new Date(2026, 0, 9),
          trashedAt: new Date(2026, 0, 9),
        },
      },
    ])(
      'should update the user note with the same fields',
      async ({ data, expected }) => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent(data.noteId)}`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data.payload),
            method: 'PUT',
          },
        );

        // Assert
        expect(response.statusCode).toBe(200);

        const resJson = await response.body.json();

        const userId = (
          await getSessionUser({
            email: 'foo@doe.com',
            password: '12345678',
          })
        ).id;

        expect(resJson).toMatchObject({
          data: {
            note: {
              id: expected.id,
              title: expected.title,
              jsonContent: expected.jsonContent,
              createdAt: expected.createdAt.toISOString(),
              updatedAt: expected.updatedAt.toISOString(),
              authorId: userId,
            },
          },
        });

        const updatedNote = await prismaClient.note.findUnique({
          where: { id: data.noteId },
        });

        expect(updatedNote).toMatchObject({
          ...expected,
          authorId: userId,
        });
      },
    );

    test('should update all note fields of a user note', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Updated Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: true,
          }),
          method: 'PUT',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Updated Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Updated Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
      });
    });
  });

  describe('PATCH /notes/:noteId', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
          {
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              title: 'Updated Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
              status: 'archived',
              isTrashed: true,
            }),
            method: 'PATCH',
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });

      test.for([
        {},
        { title: [...new Array(129).map(() => 'A')] },
        { jsonContent: 'invalid' },
        { status: 'unknown' },
        { isTrashed: 'unknown' },
      ])(
        'should return 400 when the body request is invalid',
        async (bodyRequest) => {
          // Arrange & Action
          const response = await request(
            `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
            {
              headers: new Headers({
                Cookie: await getSessionCookieValue({
                  email: 'foo@doe.com',
                  password: '12345678',
                }),
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(bodyRequest),
              method: 'PATCH',
            },
          );

          // Assert
          expect(response.statusCode).toBe(400);

          const resJson = await response.body.json();

          expect(resJson).toMatchObject({
            title: 'Body Request Validation Error',
            status: 400,
            detail: 'One or more body request fields are invalid.',
          });

          expect(resJson).toHaveProperty('errors');
        },
      );

      test('should return 404 when fetching a non-existent user note ', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000100')}`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              title: 'Updated Title Note 1 (Foo Doe)',
              jsonContent:
                '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
              status: 'archived',
              isTrashed: true,
            }),
            method: 'PATCH',
          },
        );

        // Assert
        expect(response.statusCode).toBe(404);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Resource Not Found',
          status: 404,
          detail: 'Note is not found.',
          errors: {},
        });
      });
    });

    test.for([
      {
        titlePayload: '',
        expected: 'Untitled',
      },
      {
        titlePayload: 'Updated Note Title 1',
        expected: 'Updated Note Title 1',
      },
      {
        titlePayload: [...new Array(128).map(() => 'A')].join(),
        expected: [...new Array(128).map(() => 'A')].join(),
      },
    ])('should patch the note title', async ({ titlePayload, expected }) => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: titlePayload,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: expected,
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: expected,
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
      });
    });

    test('should patch the note jsonContent', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
      });
    });

    test('should patch an active note with an "archived" status payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            status: 'archived',
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            updatedAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 0, 1),
        trashedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        archivedAt: null,
      });
    });

    test('should patch an archived note with an "active" status payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000005')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            status: 'active',
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000005',
            title: 'Title Note 5 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 5).toISOString(),
            updatedAt: new Date(2026, 0, 5).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000005' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000005',
        title: 'Title Note 5 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 5 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 5),
        updatedAt: new Date(2026, 0, 5),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });
    });

    test('should patch an active note with a Boolean true value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            isTrashed: true,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            updatedAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 0, 1),
        archivedAt: null,
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        trashedAt: null,
      });
    });

    test('should patch an archived note with a Boolean true value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000004')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            isTrashed: true,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000004',
            title: 'Title Note 4 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 4).toISOString(),
            updatedAt: new Date(2026, 0, 4).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000004' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000004',
        title: 'Title Note 4 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 4),
        updatedAt: new Date(2026, 0, 4),
        archivedAt: new Date(2026, 0, 4),
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        trashedAt: null,
      });
    });

    test('should patch a trashed active note with a Boolean false value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000007')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            isTrashed: false,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000007',
            title: 'Title Note 7 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 7 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 7).toISOString(),
            updatedAt: new Date(2026, 0, 7).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000007' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000007',
        title: 'Title Note 7 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 7 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 7),
        updatedAt: new Date(2026, 0, 7),
        archivedAt: null,
        trashedAt: null,
        authorId: userId,
      });
    });

    test('should patch a trashed archived note with a Boolean false value of the isTrashed payload field', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000009')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            isTrashed: false,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000009',
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 9).toISOString(),
            updatedAt: new Date(2026, 0, 9).toISOString(),
            authorId: userId,
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000009' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000009',
        title: 'Title Note 9 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 9),
        updatedAt: new Date(2026, 0, 9),
        archivedAt: new Date(2026, 0, 9),
        trashedAt: null,
        authorId: userId,
      });
    });

    test.for([
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000001',
          payload: {
            title: 'Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: false,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000001',
          title: 'Title Note 1 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 1 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 1),
          updatedAt: new Date(2026, 0, 1),
          archivedAt: null,
          trashedAt: null,
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000004',
          payload: {
            title: 'Title Note 4 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: false,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000004',
          title: 'Title Note 4 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 4 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 4),
          updatedAt: new Date(2026, 0, 4),
          archivedAt: new Date(2026, 0, 4),
          trashedAt: null,
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000008',
          payload: {
            title: 'Title Note 8 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
            status: 'active',
            isTrashed: true,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000008',
          title: 'Title Note 8 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 8 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 8),
          updatedAt: new Date(2026, 0, 8),
          archivedAt: null,
          trashedAt: new Date(2026, 0, 8),
        },
      },
      {
        data: {
          noteId: '10000000-0000-0000-0000-000000000009',
          payload: {
            title: 'Title Note 9 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: true,
          },
        },
        expected: {
          id: '10000000-0000-0000-0000-000000000009',
          title: 'Title Note 9 (Foo Doe)',
          jsonContent:
            '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note 9 (Foo Doe)"}]}]}',
          createdAt: new Date(2026, 0, 9),
          updatedAt: new Date(2026, 0, 9),
          archivedAt: new Date(2026, 0, 9),
          trashedAt: new Date(2026, 0, 9),
        },
      },
    ])(
      'should patch the user note with the same fields',
      async ({ data, expected }) => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent(data.noteId)}`,
          {
            headers: new Headers({
              Cookie: await getSessionCookieValue({
                email: 'foo@doe.com',
                password: '12345678',
              }),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data.payload),
            method: 'PATCH',
          },
        );

        // Assert
        expect(response.statusCode).toBe(200);

        const resJson = await response.body.json();

        const userId = (
          await getSessionUser({
            email: 'foo@doe.com',
            password: '12345678',
          })
        ).id;

        expect(resJson).toMatchObject({
          data: {
            note: {
              id: expected.id,
              title: expected.title,
              jsonContent: expected.jsonContent,
              createdAt: expected.createdAt.toISOString(),
              updatedAt: expected.updatedAt.toISOString(),
              authorId: userId,
            },
          },
        });

        const updatedNote = await prismaClient.note.findUnique({
          where: { id: data.noteId },
        });

        expect(updatedNote).toMatchObject({
          ...expected,
          authorId: userId,
        });
      },
    );

    test('should patch all note fields of a user note', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000001')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: 'Updated Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            status: 'archived',
            isTrashed: true,
          }),
          method: 'PATCH',
        },
      );

      // Assert
      expect(response.statusCode).toBe(200);

      const resJson = await response.body.json();

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      expect(resJson).toMatchObject({
        data: {
          note: {
            id: '10000000-0000-0000-0000-000000000001',
            title: 'Updated Title Note 1 (Foo Doe)',
            jsonContent:
              '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
            createdAt: new Date(2026, 0, 1).toISOString(),
            authorId: userId,
          },
        },
      });

      expect(resJson).not.toMatchObject({
        data: {
          note: {
            updatedAt: new Date(2026, 0, 1).toISOString(),
          },
        },
      });

      const updatedNote = await prismaClient.note.findUnique({
        where: { id: '10000000-0000-0000-0000-000000000001' },
      });

      expect(updatedNote).toMatchObject({
        id: '10000000-0000-0000-0000-000000000001',
        title: 'Updated Title Note 1 (Foo Doe)',
        jsonContent:
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Updated content note 1 (Foo Doe)"}]}]}',
        createdAt: new Date(2026, 0, 1),
        authorId: userId,
      });

      expect(updatedNote).not.toMatchObject({
        updatedAt: new Date(2026, 0, 1),
        archivedAt: null,
        trashedAt: null,
      });
    });
  });

  describe('DELETE /notes/:noteId', () => {
    describe('Failed Scenarios', () => {
      test('should return 401 without authentication', async () => {
        // Arrange & Action
        const response = await request(
          `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000008')}`,
          {
            method: 'DELETE',
          },
        );

        // Assert
        expect(response.statusCode).toBe(401);

        const resJson = await response.body.json();

        expect(resJson).toEqual({
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication is required.',
          errors: {},
        });
      });
    });

    test('should delete a user note in the trash', async () => {
      // Arrange & Action
      const response = await request(
        `http://localhost:${envs.server.port}/api/v1/notes/${encodeURIComponent('10000000-0000-0000-0000-000000000008')}`,
        {
          headers: new Headers({
            Cookie: await getSessionCookieValue({
              email: 'foo@doe.com',
              password: '12345678',
            }),
          }),
          method: 'DELETE',
        },
      );

      // Assert
      expect(response.statusCode).toBe(204);

      const userId = (
        await getSessionUser({
          email: 'foo@doe.com',
          password: '12345678',
        })
      ).id;

      await expect(
        prismaClient.note.findMany({
          where: {
            trashedAt: null,
            authorId: userId,
          },
        }),
      ).resolves.toHaveLength(6);

      await expect(
        prismaClient.note.findMany({
          where: {
            trashedAt: { not: null },
            authorId: userId,
          },
        }),
      ).resolves.toHaveLength(2);
    });
  });
});
