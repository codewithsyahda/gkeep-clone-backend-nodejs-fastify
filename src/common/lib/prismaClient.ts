import '../config/dotenv.js';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client.js';
import envs from '../config/envs.js';

const prismaClient = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: envs.database.connUrl,
  }),
});

export default prismaClient;
