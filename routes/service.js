import postgresql from '../middlewares/postgresql';
import mysql from '../middlewares/mysql';
import moment from 'moment';

moment.locale('ko');

export default {
  registerGet(req, res, next) {
    res.render('service-register', {
      _csrfToken: req.csrfToken(),
      title: '민원등록 |', // TODO: Fill in user organisation name
    });
  },

  registerScheduleGet(req, res, next) {
    mysql.executeQuery(
      `SELECT * FROM wtt_sch_address;`,
      [],
    ).then(result => {
      res.status(200).json(result);
    });
  },

  registerPost(req, res, next) {
    const _body = req.body;
    postgresql.executeQuery(
      `INSERT INTO wtt_wser_ma
         VALUES (DEFAULT, ST_SetSRID(ST_MakePoint($1, $2), 5187), $1, $2, date_part('year', CURRENT_DATE), $3, $4, $5,
                 $6, $7, (SELECT codeno FROM private.cd_apy WHERE cname = $8), $9,
                 (SELECT codeno FROM private.cd_lep WHERE cname = $10), $11, $12, $13, $14,
                 (SELECT codeno FROM private.cd_pro WHERE cname = $15), NULL, NULL, $16, $17, DEFAULT);`,
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
        _body['dur_ymd'],
        _body['pro_cde'],
        _body['pro_nam'],
        _body['opr_nam'],
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

  searchPost(req, res, next) {
    postgresql.executeQuery(
      `SELECT * FROM viw_wtt_wser_ma ORDER BY id DESC;`,
      [], // TODO: '상수' Role 처리
    )
      .then(formatSelect)
      .then(result => {
        res.status(200).json(result);
      });
  },
};

function formatSelect(response) {
  let records = {
    iTotalRecords: response.rowCount,
    iTotalDisplayRecords: 5,
    sEcho: 0,
    aaData: response.rows,
  };
  (records.aaData).forEach(function (record) {
    record['일자'] = moment(record['일자']).format('YYYY.MM.DD');
    record['기한'] = moment(record['기한']).format('YYYY.MM.DD');
    let address = record['주소'].split('/');
    record['주소'] = address[1].trim() !== '' ? address[1].trim() : address[0].trim();
    let pos = record['누수'] ? record['누수'] + ' ' : '';
    let dip = record['관경'] ? record['관경'] + ' ' + 'mm' + ' ' : '';
    record['상세'] = pos + dip + record['상세'];
    record['관경'] = record['관경'] ? record['관경'] + ' ' + 'mm' : '';
    record['기능'] = null;
  });
  return records;
}
