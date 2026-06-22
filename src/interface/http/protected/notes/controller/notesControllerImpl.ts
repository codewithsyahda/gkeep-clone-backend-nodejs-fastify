import type { FastifyReply, FastifyRequest } from 'fastify';

import type { INoteUseCase } from '@/application/use-case/note/noteUseCase.js';
import { WebResponseSuccess } from '@/model/http.js';
import { CreateNoteRequest, UpdateNoteRequest } from '@/model/note/note.js';
import { type TNoteRoutesSchemas } from '../notesRoutesSchema.js';
import type { INoteController } from './notesController.js';

class NoteControllerImpl implements INoteController {
  protected readonly _noteUseCase: INoteUseCase;

  constructor(noteUseCase: INoteUseCase) {
    this._noteUseCase = noteUseCase;

    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.getById = this.getById.bind(this);
    this.updateById = this.updateById.bind(this);
    this.patchById = this.patchById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async getAll(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['GET']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['GET']>,
  ): Promise<void> {
    const userId = request.getDecorator<string>('userId');

    const { search, is_active, is_archived, is_trashed } = request.query;

    const result = await this._noteUseCase.getAll(userId, {
      ...(search
        ? {
            search,
          }
        : {}),
      ...(is_active
        ? {
            isActive: is_active,
          }
        : {}),
      ...(is_archived
        ? {
            isArchived: is_archived,
          }
        : {}),
      ...(is_trashed
        ? {
            isTrashed: is_trashed,
          }
        : {}),
    });

    await reply.status(200).send(new WebResponseSuccess(result));
  }

  async create(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['POST']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['POST']>,
  ): Promise<void> {
    const { title, jsonContent } = request.body;

    const userId = request.getDecorator<string>('userId');

    const result = await this._noteUseCase.create(
      userId,
      new CreateNoteRequest(title, jsonContent),
    );

    await reply.status(201).send(new WebResponseSuccess(result));
  }

  async deleteAll(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['DELETE']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['DELETE']>,
  ): Promise<void> {
    const userId = request.getDecorator<string>('userId');

    await this._noteUseCase.deleteAll(userId);

    await reply.status(204).send();
  }

  async getById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['GET']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['GET']>,
  ): Promise<void> {
    const { noteId } = request.params;

    const userId = request.getDecorator<string>('userId');

    const result = await this._noteUseCase.getById(userId, noteId);

    await reply.status(200).send(new WebResponseSuccess(result));
  }

  async updateById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['PUT']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['PUT']>,
  ): Promise<void> {
    const { noteId } = request.params;

    const userId = request.getDecorator<string>('userId');

    const result = await this._noteUseCase.updateById(
      userId,
      noteId,
      new UpdateNoteRequest(request.body),
    );

    await reply.status(200).send(new WebResponseSuccess(result));
  }

  async patchById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['PATCH']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['PATCH']>,
  ): Promise<void> {
    const { noteId } = request.params;

    const userId = request.getDecorator<string>('userId');

    const result = await this._noteUseCase.patchById(
      userId,
      noteId,
      request.body,
    );

    await reply.status(200).send(new WebResponseSuccess(result));
  }

  async deleteById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['DELETE']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['DELETE']>,
  ): Promise<void> {
    const { noteId } = request.params;

    const userId = request.getDecorator<string>('userId');

    await this._noteUseCase.deleteById(userId, noteId);

    await reply.status(204).send();
  }
}

export default NoteControllerImpl;
