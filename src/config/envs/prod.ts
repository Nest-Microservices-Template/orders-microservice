export const config = {
  db: {
    extra: {
      connectionLimit: 10,
    },
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: false,
    logging: false,
  },
};
