import { PrismaPg } from '@prisma/adapter-pg';

import envs from '@/common/config/envs.js';
import { PrismaClient } from '@/generated/prisma/client.js';

const prismaClient = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: envs.database.connUrl,
  }),
});

export default prismaClient;
