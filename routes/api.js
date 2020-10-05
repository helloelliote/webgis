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
    const table = req.query['table'];
    const column = req.query['column'];
    const section = req.query['section'];

    if (table && !section) {
      postgresql.executeQuery(
        `SELECT '${table}' AS "table", '${column}' AS "column", ${column} AS "section" FROM ${table} ORDER BY ${column} ASC;`,
        [],
      ).then(result => {
        res.status(200).json(result);
      });
    }

    if (table && section) {
      postgresql.executeQuery(
        `SELECT st_asgeojson(${table}.geom) AS coordinate FROM ${table} WHERE ${column}='${section}';`,
        [],
      ).then(result => {
        res.status(200).json(result);
      });
    }

    // TODO: Select children or parent sections
    // const child = req.query['child'];
    // const childColumn = req.query['childColumn'];
    //
    // if (child && childColumn) {
    //   postgresql.executeQuery(
    //     `SELECT '${child}' AS "table", '${childColumn}' AS "column", ${childColumn} AS "section" FROM ${child} WHERE ${column}='${section}' ORDER BY ${childColumn} ASC;`,
    //     [],
    //   ).then(result => {
    //     res.status(200).json(result);
    //   });
    // }
  });
}

function reformat(rawData) {
  return rawData;
}
