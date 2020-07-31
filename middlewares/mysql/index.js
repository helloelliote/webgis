import mysql from 'mysql2';

export default class Mysql {

  constructor(options) {
    if (Mysql.exists) {
      return Mysql.instance;
    }

    options = Object.assign({}, options);

    this._pool = mysql.createPool({
      host: process.env.MSHOST,
      port: process.env.MSPORT,
      user: process.env.MSUSER,
      password: process.env.MSPASSWORD,
      database: process.env.MSDATABASE,
    });

    Mysql.instance = this;
    Mysql.exists = true;

    return this;
  }

  get pool() {
    return this._pool;
  }
  
  executeQuery(text, params) {
    return this._pool.promise()
      .query(text, params)
      .then(([result, fields]) => {
        return result;
      }, reason => {

      });
  }
}
