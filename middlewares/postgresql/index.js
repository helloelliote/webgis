import { Pool } from 'pg';

export default class Postgresql {

  constructor(options) {
    if (Postgresql.exists) {
      return Postgresql.instance;
    }

    options = Object.assign({}, options);

    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

    Postgresql.instance = this;
    Postgresql.exists = true;

    return this;
  }
  
  get pool() {
    return this._pool;
  }

  executeQuery(text, params) {
    return this._pool.connect().then(client => {
      return client
        .query(text, params)
        .then(value => {
          if (value.rowCount > 0) {
            return value.rows;
          }
        }, reason => {
        // rejection
        })
        .finally(() => {
          client.release();
        });
    }, reason => {
      // rejection
    });
  }

  end() {
    this._pool.end().then(() => {});
  }
}
