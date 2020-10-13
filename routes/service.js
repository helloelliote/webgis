import postgresql from '../middlewares/postgresql';

export default {
  registerGet(req, res, next) {
    res.render('service-register', {
      _csrfToken: req.csrfToken(),
      title: '민원등록 |', // TODO: Fill in user organisation name
    });
  },

  registerPost(req, res, next) {
    const _body = req.body;
    postgresql.executeQuery(
      `INSERT INTO wtt_wser_ma
VALUES (DEFAULT, ST_SetSRID(ST_MakePoint($1, $2), 5187), date_part('year', CURRENT_DATE), $3, $4, $5, $6, $7,
        (SELECT codeno FROM private.cd_apy WHERE cname = $8), $9,
        (SELECT codeno FROM private.cd_lep WHERE cname = $10), $11, $12, $13, NULL, DEFAULT, NULL, NULL, $14,
        NULL, DEFAULT);`,
      [
        _body['x'],
        _body['y'],
        _body['rcv_ymd'],
        _body['rcv_nam'],
        _body['apl_hjd'],
        _body['apl_adr'],
        _body['apl_exp'],
        _body['apy_cde'],
        _body['pip_dip'] === '' ? null : _body['pip_dip'],
        _body['lep_cde'] === '' ? null : _body['lep_cde'],
        _body['apm_nam'],
        _body['apm_adr_jibun'] + '/' + _body['apm_adr_road'] + ' ' + _body['apm_adr_desc'],
        _body['apm_tel'],
        _body['pro_nam'],
      ], // TODO: '상수' Role 처리
    ).then(result => {
      res.status(200).json({ result: result });
    });
  },

  searchGet(req, res, next) {
    res.render('service-search', {
      _csrfToken: req.csrfToken(),
      title: '민원검색 |', // TODO: Fill in user organisation name
    });
  },
};
