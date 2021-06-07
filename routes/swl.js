import postgresql from '../middlewares/postgresql';
import mysql from '../middlewares/mysql';

export default {
  search(req, res, next) {
    postgresql.executeQuery(
      `SELECT *
       FROM viw_search_tb
       WHERE (fac_nam LIKE $1 OR cname LIKE $1 OR ftr_idn=$2) 
         AND (role_name = $3)
       ORDER BY cname, (CASE WHEN fac_nam IS NULL OR fac_nam = '' THEN 1 ELSE 0 END), fac_nam ASC;`,
      [`%${req.query['query']}%`, req.query['query'], '하수'], // TODO: '하수' Role 처리
    ).then(result => {
      res.status(200).json(result);
    }).catch(next);
  },

  info(req, res, next) {
    postgresql.executeQuery(`SELECT * FROM ${req.query['table']} WHERE 관리번호=$1;`,
      [req.query['id']],
    ).then(result => {
      res.status(200).json(result);
    }).catch(next);
  },

  infoPhoto(req, res, next) {
    mysql.executeQuery(`SELECT * FROM ${req.query['table']} WHERE 시설물구분="${req.query['layer']}" AND 관리번호=${req.query['id']} ORDER BY 사진일련번호 ASC;`,
      [],
    ).then(result => {
      res.status(200).json(result);
    }).catch(next);
  },
};
