import postgresql from '../middlewares/postgresql/index';

export default function (router) {
  router.get('/test', function (req, res, next){
    postgresql.executeQuery(`SELECT layer FROM wtl_pipe_lm WHERE ftr_idn = $1;`, [req.query.id])
      .then(reformat)
      .then(result => {
        res.status(200).json(result);
      });
  });
}

function reformat(rawData) {
  return rawData;
}
