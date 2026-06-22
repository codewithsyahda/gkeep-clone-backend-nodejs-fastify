import fastifyCors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import envs from '@/common/config/envs.js';

const cors: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCors, {
    origin: envs.auth.trustedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });
};

export default fastifyPlugin(cors);
