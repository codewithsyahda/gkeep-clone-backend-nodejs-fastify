import Fastify, { type FastifyServerOptions } from 'fastify';

import routes from '@/interface/http/routes.js';
import prismaClient from '../lib/prismaClient.js';

export default function createFastify(opts: FastifyServerOptions = {}) {
  const fastify = Fastify(opts);

  fastify.register(routes, {
    prefix: '/api/v1',
  });

  fastify.addHook('onClose', async (fastify) => {
    try {
      fastify.log.info('Disconnecting PrismaClient...');
      await prismaClient.$disconnect();
      fastify.log.info('PrismaClient disconnected successfully');
    } catch {
      fastify.log.error('Failed to disconnect PrismaClient');
    }
  });

  return fastify;
}
