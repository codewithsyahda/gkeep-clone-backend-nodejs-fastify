import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import envs from '../config/envs.js';
import prismaClient from './prismaClient.js';

const auth = betterAuth({
  basePath: '/api/v1/auth',
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  database: prismaAdapter(prismaClient, {
    provider: 'postgresql',
  }),
  advanced: {
    cookiePrefix: 'auth',
  },
  trustedOrigins: envs.auth.trustedOrigins,
});

export default auth;
