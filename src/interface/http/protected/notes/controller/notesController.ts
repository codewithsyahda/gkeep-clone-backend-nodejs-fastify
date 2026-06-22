import type { FastifyReply, FastifyRequest } from 'fastify';

import type { TNoteRoutesSchemas } from '../notesRoutesSchema.js';

export interface INoteController {
  getAll(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['GET']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['GET']>,
  ): Promise<void>;
  create(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['POST']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['POST']>,
  ): Promise<void>;
  getById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['GET']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['GET']>,
  ): Promise<void>;
  updateById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['PUT']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['PUT']>,
  ): Promise<void>;
  patchById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['PATCH']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['PATCH']>,
  ): Promise<void>;
  deleteById(
    request: FastifyRequest<TNoteRoutesSchemas['/notes/:noteId']['DELETE']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes/:noteId']['DELETE']>,
  ): Promise<void>;
  deleteAll(
    request: FastifyRequest<TNoteRoutesSchemas['/notes']['DELETE']>,
    reply: FastifyReply<TNoteRoutesSchemas['/notes']['DELETE']>,
  ): Promise<void>;
}
