'use strict';

import postgresql from '../middlewares/postgresql';

export default function (router) {
  router.post('/test', function (req, res, next){
    postgresql.executeQuery(`SELECT layer FROM wtl_pipe_lm WHERE ftr_idn = $1;`, [9833])
      .then(reformat)
      .then(result => {
        res.status(200).json(result);
      });
  });
}

function reformat(rawData) {
  return rawData;
}
