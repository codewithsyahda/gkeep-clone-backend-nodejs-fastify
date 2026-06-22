import type { IDocumentSchema } from '@/application/utility/documentSchema.js';
import BadRequestError from '@/common/exception/badRequestError.js';
import type { INoteRepository } from '@/domain/note/repository/noteRepository.js';
import {
  noteDetailConverter,
  noteSimpleConverter,
} from '@/model/note/converter/noteConverter.js';
import {
  CreateNoteRequest,
  NoteDetailResponse,
  NoteSimpleResponse,
  UpdateNoteRequest,
} from '@/model/note/note.js';
import type { INoteUseCase } from './noteUseCase.js';

class NoteUseCaseImpl implements INoteUseCase {
  protected readonly _noteRepository: INoteRepository;
  protected readonly _documentSchema: IDocumentSchema;

  constructor({
    noteRepository,
    documentSchema,
  }: Readonly<{
    noteRepository: INoteRepository;
    documentSchema: IDocumentSchema;
  }>) {
    this._noteRepository = noteRepository;
    this._documentSchema = documentSchema;
  }

  async getAll(
    userId: string,
    filters: {
      search?: string;
      isActive?: 'true' | 'false';
      isArchived?: 'true' | 'false';
      isTrashed?: 'true' | 'false';
    } = {},
  ): Promise<{
    notes: {
      active: NoteSimpleResponse[];
      archived: NoteSimpleResponse[];
      trash: NoteSimpleResponse[];
    };
  }> {
    const { search, isActive, isArchived, isTrashed } = filters;

    const containsFilter = search
      ? {
          contains: search,
        }
      : {};

    const isActiveFilter =
      isActive === 'true'
        ? {
            isActive: true,
          }
        : {};

    const isArchivedFilter =
      isArchived === 'true'
        ? {
            isArchived: true,
          }
        : {};

    const isTrashedFilter =
      isTrashed === 'true'
        ? {
            isTrashed: true,
          }
        : {};

    const notes = await this._noteRepository.getMany(userId, {
      ...containsFilter,
      ...isActiveFilter,
      ...isArchivedFilter,
      ...isTrashedFilter,
    });

    return {
      notes: {
        active: notes
          .filter((n) => n.archivedAt === null && n.trashedAt === null)
          .map((n) => noteSimpleConverter(n)),
        archived: notes
          .filter((n) => n.archivedAt !== null && n.trashedAt === null)
          .map((n) => noteSimpleConverter(n)),
        trash: notes
          .filter((n) => n.trashedAt !== null)
          .map((n) => noteSimpleConverter(n)),
      },
    };
  }

  async getById(
    userId: string,
    noteId: string,
  ): Promise<{ note: NoteDetailResponse }> {
    return {
      note: noteDetailConverter(
        await this._noteRepository.getById(userId, noteId),
      ),
    };
  }

  async create(
    userId: string,
    { title, jsonContent }: CreateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }> {
    let textContent: string;

    try {
      textContent = this._documentSchema.jsonDocStrToText(jsonContent);
    } catch {
      throw new BadRequestError({
        title: 'Body Request Validation Error',
        message: 'One or more body request fields are invalid.',
        errors: [
          {
            field: 'jsonContent',
            message: 'Must be a valid JSON document schema',
          },
        ],
      });
    }

    return {
      note: noteSimpleConverter(
        await this._noteRepository.insert({
          userId,
          title: title === '' ? 'Untitled' : title,
          jsonContent,
          textContent,
        }),
      ),
    };
  }

  async updateById(
    userId: string,
    noteId: string,
    { title, jsonContent, status, isTrashed }: UpdateNoteRequest,
  ): Promise<{ note: NoteSimpleResponse }> {
    const oldNote = await this._noteRepository.getById(userId, noteId);

    let textContent: string;

    try {
      textContent = this._documentSchema.jsonDocStrToText(jsonContent);
    } catch {
      throw new BadRequestError({
        title: 'Body Request Validation Error',
        message: 'One or more body request fields are invalid.',
        errors: [
          {
            field: 'jsonContent',
            message: 'Must be a valid JSON document schema',
          },
        ],
      });
    }

    let finalUpdatedAt = oldNote.updatedAt;

    if (
      (title.trim() && title !== oldNote.title) ||
      (title.trim() === '' && oldNote.title !== 'Untitled') ||
      jsonContent !== oldNote.jsonContent
    ) {
      finalUpdatedAt = new Date();
    }

    let finalArchivedAt = oldNote.archivedAt;

    if (status === 'active' && oldNote.archivedAt !== null) {
      finalArchivedAt = null;
    }

    if (status === 'archived' && oldNote.archivedAt === null) {
      finalArchivedAt = new Date();
    }

    let finalTrashedAt = oldNote.trashedAt;

    if (isTrashed && oldNote.trashedAt === null) {
      finalTrashedAt = new Date();
    }

    if (!isTrashed && oldNote.trashedAt !== null) {
      finalTrashedAt = null;
    }

    const updatedNote = await this._noteRepository.updateById({
      noteId,
      payload: {
        title: title || 'Untitled',
        jsonContent,
        textContent,
        updatedAt: finalUpdatedAt,
        archivedAt: finalArchivedAt,
        trashedAt: finalTrashedAt,
      },
    });

    return {
      note: noteSimpleConverter(updatedNote),
    };
  }

  async patchById(
    userId: string,
    noteId: string,
    { title, jsonContent, status, isTrashed }: Partial<UpdateNoteRequest>,
  ): Promise<{ note: NoteSimpleResponse }> {
    if (
      title === undefined &&
      jsonContent === undefined &&
      status === undefined &&
      isTrashed === undefined
    ) {
      throw new BadRequestError({
        title: 'Body Request Validation Error',
        message: 'Must have at least one body request field',
        errors: [],
      });
    }

    const oldNote = await this._noteRepository.getById(userId, noteId);

    let finalUpdatedAt: Date | string = oldNote.updatedAt;
    let finalArchivedAt: Date | string | null = oldNote.archivedAt;
    let finalTrashedAt: Date | string | null = oldNote.trashedAt;

    if (
      (typeof title === 'string' && title.trim() && title !== oldNote.title) ||
      (typeof title === 'string' &&
        title.trim() === '' &&
        oldNote.title !== 'Untitled') ||
      (typeof jsonContent === 'string' && jsonContent !== oldNote.jsonContent)
    ) {
      finalUpdatedAt = new Date();
    }

    if (status === 'active' && oldNote.archivedAt !== null) {
      finalArchivedAt = null;
    }

    if (status === 'archived' && oldNote.archivedAt === null) {
      finalArchivedAt = new Date();
    }

    if (isTrashed === false && oldNote.trashedAt !== null) {
      finalTrashedAt = null;
    }

    if (isTrashed === true && oldNote.trashedAt === null) {
      finalTrashedAt = new Date();
    }

    let textContent: string;

    try {
      textContent =
        jsonContent === undefined
          ? this._documentSchema.jsonDocStrToText(oldNote.jsonContent)
          : this._documentSchema.jsonDocStrToText(jsonContent);
    } catch {
      throw new BadRequestError({
        title: 'Body Request Validation Error',
        message: 'One or more body request fields are invalid.',
        errors: [
          {
            field: 'jsonContent',
            message: 'Must be a valid JSON document schema',
          },
        ],
      });
    }

    const updatedNote = await this._noteRepository.updateById({
      noteId,
      payload: {
        title: title === undefined ? oldNote.title : title || 'Untitled',
        jsonContent:
          jsonContent === undefined ? oldNote.jsonContent : jsonContent,
        textContent,
        updatedAt: finalUpdatedAt,
        archivedAt: finalArchivedAt,
        trashedAt: finalTrashedAt,
      },
    });

    return {
      note: noteSimpleConverter(updatedNote),
    };
  }

  async deleteAll(userId: string): Promise<void> {
    await this._noteRepository.deleteMany(userId);
  }

  async deleteById(userId: string, noteId: string): Promise<void> {
    await this._noteRepository.deleteById(userId, noteId);
  }
}

export default NoteUseCaseImpl;
