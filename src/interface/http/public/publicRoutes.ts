import { type FastifyPluginAsync } from 'fastify';

import authRoute from './auth.route.js';

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoute);
};

export default publicRoutes;
