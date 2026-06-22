const envs = {
  nodeEnv: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
  },
  database: {
    connUrl: process.env.DATABASE_URL,
  },
  auth: {
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') ?? [],
  },
};

export default envs;
