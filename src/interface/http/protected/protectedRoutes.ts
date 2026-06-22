import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyPluginAsync } from 'fastify';

import type { INoteUseCase } from '@/application/use-case/note/noteUseCase.js';
import AuthorizationError from '@/common/exception/authorizationError.js';
import auth from '@/common/lib/auth.js';
import notesRoute from './notes/notes.route.js';

const protectedRoutes: FastifyPluginAsync<{
  deps: {
    noteUseCase: INoteUseCase;
  };
}> = async (fastify, { deps }) => {
  fastify.register(notesRoute, { deps });

  fastify.decorateRequest('userId', '');

  fastify.addHook('preHandler', async (request) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new AuthorizationError();
    }

    request.setDecorator('userId', session.user.id);
  });
};

export default protectedRoutes;
