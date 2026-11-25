const { Pool } = require("pg");

// V produkciji (Neon) se uporabi DATABASE_URL, lokalno posamezne DB_* spremenljivke.
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
);

module.exports = pool;
