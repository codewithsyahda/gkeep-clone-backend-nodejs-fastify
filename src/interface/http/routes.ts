import fastifyHelmet from '@fastify/helmet';
import type { FastifyPluginAsync } from 'fastify';

import NoteUseCaseImpl from '@/application/use-case/note/noteUseCaseImpl.js';
import prismaClient from '@/common/lib/prismaClient.js';
import cors from '@/common/plugin/fastify/cors.js';
import NoteRepositoryImpl from '@/infrastructure/repository/noteRepositoryImpl.js';
import DocumentSchemaImpl from '@/infrastructure/utility/documentSchemaImpl.js';
import errorHandler from './errorHandler.js';
import protectedRoutes from './protected/protectedRoutes.js';
import publicRoutes from './public/publicRoutes.js';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(cors);
  fastify.register(fastifyHelmet);

  fastify.register(errorHandler);

  fastify.register(publicRoutes);

  fastify.register(protectedRoutes, {
    deps: {
      noteUseCase: new NoteUseCaseImpl({
        noteRepository: new NoteRepositoryImpl(prismaClient),
        documentSchema: new DocumentSchemaImpl(),
      }),
    },
  });
};

export default routes;
