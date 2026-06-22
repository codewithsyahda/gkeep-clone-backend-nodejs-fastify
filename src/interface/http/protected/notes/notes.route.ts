import type { FastifyPluginAsync } from 'fastify';

import type { INoteUseCase } from '@/application/use-case/note/noteUseCase.js';
import NoteControllerImpl from './controller/notesControllerImpl.js';
import { notesRoutesSchemas } from './notesRoutesSchema.js';

const notesRoute: FastifyPluginAsync<{
  deps: {
    noteUseCase: INoteUseCase;
  };
}> = async (fastify, { deps }) => {
  const controller = new NoteControllerImpl(deps.noteUseCase);

  fastify.get(
    '/notes',
    {
      schema: notesRoutesSchemas['/notes'].GET.schema,
    },
    controller.getAll,
  );

  fastify.post(
    '/notes',
    {
      schema: notesRoutesSchemas['/notes'].POST.schema,
    },
    controller.create,
  );

  fastify.delete(
    '/notes',
    {
      schema: notesRoutesSchemas['/notes'].DELETE.schema,
    },
    controller.deleteAll,
  );

  fastify.get(
    '/notes/:noteId',
    {
      schema: notesRoutesSchemas['/notes/:noteId'].GET.schema,
    },
    controller.getById,
  );

  fastify.put(
    '/notes/:noteId',
    {
      schema: notesRoutesSchemas['/notes/:noteId'].PUT.schema,
    },
    controller.updateById,
  );

  fastify.patch(
    '/notes/:noteId',
    {
      schema: notesRoutesSchemas['/notes/:noteId'].PATCH.schema,
    },
    controller.patchById,
  );

  fastify.delete(
    '/notes/:noteId',
    {
      schema: notesRoutesSchemas['/notes/:noteId'].DELETE.schema,
    },
    controller.deleteById,
  );
};

export default notesRoute;
