export default () => ({
  github: {
    app: {
      id: process.env.GITHUB_APP_ID,
      client: {
        id: process.env.GITHUB_APP_CLIENT_ID,
        secret: process.env.GITHUB_APP_CLIENT_SECRET,
      },
      callback: {
        url: process.env.GITHUB_CALLBACK_URL,
      },
    },
  },

  db: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  },

  port: parseInt(process.env.PORT ?? '3000', 10),

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
});
