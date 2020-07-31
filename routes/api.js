import Postgres from '../middlewares/postgresql';

const pg = new Postgres();

export default {
  postgresQuery(req, res, next) {
    pg.executeQuery(`SELECT layer FROM wtl_pipe_lm WHERE ftr_idn = $1;`, [9833])
      .then(result => {
        res.status(200).json(result);
      });
  },
};
