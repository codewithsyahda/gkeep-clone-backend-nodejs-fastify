import './common/config/dotenv.js';

import envs from './common/config/envs.js';
import createFastify from './common/config/fastify.js';

const fastify = createFastify({
  logger:
    envs.nodeEnv === 'production'
      ? true
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        },
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
    host: envs.nodeEnv === 'production' ? '0.0.0.0' : '127.0.0.1',
    port: envs.server.port,
  });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
