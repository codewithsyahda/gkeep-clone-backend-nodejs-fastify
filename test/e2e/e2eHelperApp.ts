import '../config/dotenv.js';

import { fromNodeHeaders } from 'better-auth/node';
import Fastify from 'fastify';

import auth from './common/lib/auth.js';
import prismaClient from './common/lib/prismaClient.js';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

fastify.register(
  async (fst) => {
    fst.route({
      method: ['GET', 'POST'],
      url: '/auth/*',
      async handler(request, reply) {
        try {
          // Construct request URL
          const url = new URL(request.url, `http://${request.headers.host}`);

          // Convert Fastify headers to standard Headers object
          const headers = fromNodeHeaders(request.headers);
          // Create Fetch API-compatible request
          const req = new Request(url.toString(), {
            method: request.method,
            headers,
            ...(request.body ? { body: JSON.stringify(request.body) } : {}),
          });
          // Process authentication request
          const response = await auth.handler(req);
          // Forward response to client
          reply.status(response.status);
          response.headers.forEach((value, key) => reply.header(key, value));
          return reply.send(response.body ? await response.text() : null);
        } catch (error) {
          fastify.log.error(error, 'Authentication Error');
          return reply.status(500).send({
            error: 'Internal authentication error',
            code: 'AUTH_FAILURE',
          });
        }
      },
    });

    fst.delete('/tables', async (_request, replay) => {
      await prismaClient.$transaction([
        prismaClient.account.deleteMany(),
        prismaClient.session.deleteMany(),
        prismaClient.note.deleteMany(),
        prismaClient.user.deleteMany(),
      ]);

      await replay.status(204).send();
    });
  },
  {
    prefix: '/api',
  },
);

fastify.addHook('onClose', async (fastify) => {
  try {
    fastify.log.info('Disconnecting PrismaClient...');
    await prismaClient.$disconnect();
    fastify.log.info('PrismaClient disconnected successfully');
  } catch {
    fastify.log.error('Failed to disconnect PrismaClient');
  }
});

const shutdownTimeout = 30_000;
let initiatedShutdown = false;

const initiateShutdown = async () => {
  if (initiatedShutdown) return;

  initiatedShutdown = true;

  const forceExitTimeout = setTimeout(() => {
    fastify.log.error(
      `Shutdown timed out after ${shutdownTimeout}ms! Forcefully exiting.`,
    );
    process.exit(1);
  }, shutdownTimeout);

  forceExitTimeout.unref();

  try {
    fastify.log.warn(`Closing the server...`);
    await fastify.close();
    fastify.log.info('The server closed gracefully');
  } catch (error) {
    fastify.log.error(error, 'Failed to close the server');
    process.exit(1);
  }
};

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    fastify.log.warn(`Received ${signal} signal`);
    await initiateShutdown();
    process.exit(0);
  });
}

for (const uncaughtSignal of [
  'uncaughtException',
  'unhandledRejection',
] as const) {
  process.on(uncaughtSignal, async (error) => {
    fastify.log.error(error, `The ${uncaughtSignal} detected`);
    await initiateShutdown();
    process.exit(1);
  });
}

try {
  await fastify.listen({
    host: '127.0.0.1',
    port: Number(process.env.PORT_E2E),
  });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
