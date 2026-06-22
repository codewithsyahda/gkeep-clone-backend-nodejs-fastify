import NotFoundError from '@/common/exception/notFoundError.js';
import NoteEntity from '@/domain/note/entity/note.js';
import type { INoteRepository } from '@/domain/note/repository/noteRepository.js';
import { Prisma, type PrismaClient } from '@/generated/prisma/client.js';

class NoteRepositoryImpl implements INoteRepository {
  protected readonly _dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    this._dbClient = dbClient;
  }

  async getMany(
    userId: string,
    filters: {
      contains?: string;
      isActive?: boolean;
      isArchived?: boolean;
      isTrashed?: boolean;
    } = {},
  ): Promise<NoteEntity[]> {
    const sevenDays = new Date();

    sevenDays.setDate(sevenDays.getDate() - 7);

    const { contains, isActive, isArchived, isTrashed } = filters;

    const activeFilter = isActive
      ? {
          archivedAt: null,
          trashedAt: null,
        }
      : {};

    const archivedFilter = isArchived
      ? {
          archivedAt: { not: null },
          trashedAt: null,
        }
      : {};

    const trashFilter = isTrashed
      ? {
          trashedAt: {
            not: null,
            gte: sevenDays,
          },
        }
      : {};

    const notes = await this._dbClient.note.findMany({
      where: {
        AND: [
          {
            ...(contains
              ? {
                  OR: [
                    { title: { contains, mode: 'insensitive' } },
                    { textContent: { contains, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          ...(isActive || isArchived || isTrashed
            ? [
                {
                  OR: [activeFilter, archivedFilter, trashFilter],
                },
              ]
            : [
                {
                  OR: [
                    {
                      trashedAt: null,
                    },
                    {
                      trashedAt: {
                        not: null,
                        gte: sevenDays,
                      },
                    },
                  ],
                },
              ]),
        ],
        authorId: userId,
      },
      orderBy: {
        updatedAt: 'asc',
      },
      omit: {
        textContent: true,
      },
    });

    return notes.map((n) => new NoteEntity(n));
  }

  async getById(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this._dbClient.note.findUnique({
      where: {
        id: noteId,
        authorId: userId,
      },
      omit: {
        textContent: true,
      },
    });

    if (note === null) {
      throw new NotFoundError('Resource Not Found', 'Note is not found.');
    }

    return new NoteEntity(note);
  }

  async insert({
    userId,
    title,
    jsonContent,
    textContent,
  }: Readonly<{
    userId: string;
    title: string;
    jsonContent: string;
    textContent: string;
  }>): Promise<NoteEntity> {
    const note = await this._dbClient.note.create({
      data: {
        title,
        jsonContent,
        textContent,
        authorId: userId,
      },
      omit: {
        textContent: true,
      },
    });

    return new NoteEntity(note);
  }

  async updateById({
    noteId,
    payload: {
      title,
      jsonContent,
      textContent,
      updatedAt,
      archivedAt,
      trashedAt,
    },
  }: Readonly<{
    noteId: string;
    payload: {
      title: string;
      jsonContent: string;
      textContent: string;
      updatedAt: Date | string;
      archivedAt: Date | string | null;
      trashedAt: Date | string | null;
    };
  }>): Promise<NoteEntity> {
    try {
      const updatedNote = await this._dbClient.note.update({
        where: { id: noteId },
        data: {
          title,
          jsonContent,
          textContent,
          updatedAt,
          archivedAt,
          trashedAt,
        },
        omit: {
          textContent: true,
        },
      });

      return new NoteEntity(updatedNote);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Resource Not Found', 'Note is not found');
      }

      throw error;
    }
  }

  async deleteMany(userId: string): Promise<void> {
    await this._dbClient.note.deleteMany({
      where: {
        trashedAt: { not: null },
        authorId: userId,
      },
    });
  }

  async deleteById(userId: string, noteId: string): Promise<void> {
    await this._dbClient.note.deleteMany({
      where: {
        id: noteId,
        trashedAt: { not: null },
        authorId: userId,
      },
    });
  }
}

export default NoteRepositoryImpl;
