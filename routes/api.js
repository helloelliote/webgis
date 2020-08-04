'use strict';

import postgresql from '../middlewares/postgresql';

export default {
  general(req, res, next) {
    postgresql.executeQuery(`SELECT layer FROM wtl_pipe_lm WHERE ftr_idn = $1;`, [9833])
      .then(reformatAccountInfo)
      .then(result => {
        res.status(200).json(result);
      });
  },
};

function reformatAccountInfo(rawData) {
  const rows = rawData.rows;
  const total = rawData.rowCount;
  const dataset = {
    meta: {
      page: 1,
    },
    data: [],
  };
  for (let i = 0, len = rawData.rowCount; i < len; i++) {
    dataset.data[i] = rows[i];
  }
  return JSON.stringify(dataset);
}
