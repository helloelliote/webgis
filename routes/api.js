import postgresql from '../middlewares/postgresql/index';

export default function (router) {
  router.get('/test', function (req, res, next) {
    postgresql.executeQuery(`SELECT layer FROM wtl_pipe_lm WHERE ftr_idn = $1;`, [req.query.id])
      .then(reformat)
      .then(result => {
        res.status(200).json(result);
      });
  });

  router.get('/wtl/search', function (req, res, next) {
    postgresql.executeQuery(
      `SELECT * FROM viw_search_tb WHERE (fac_nam LIKE $1 OR cname LIKE $1) AND (role_name=$2) ORDER BY (CASE WHEN fac_nam IS NULL OR fac_nam='' THEN 1 ELSE 0 END), cname, fac_nam ASC;`,
      [`%${req.query['query']}%`, '상수'], // TODO: '상수' Role 처리
    ).then(result => {
      res.status(200).json(result);
    });
  });

  router.get('/wtl/section', function (req, res, next) {
    const columnName = req.query['column'];
    postgresql.executeQuery(
      `SELECT ${columnName} AS name FROM ${req.query['table']} ORDER BY ${columnName} ASC;`,
      [],
    ).then(result => {
      res.status(200).json(result);
    });
  });
}

function reformat(rawData) {
  return rawData;
}
