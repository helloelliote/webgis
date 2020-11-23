import postgresql from '../middlewares/postgresql';
import mysql from '../middlewares/mysql';
import moment from 'moment';

moment.locale('ko');

export default {
  presManageGet(req, res, next) {
    mysql.executeQuery(
      `SELECT PRS_NAM AS "가압장명",
                PRD_NAM AS "관리업체",
                CEO_TEL AS "연락처(대표)",
                PM_TEL  AS "연락처(현장소장)"
         FROM wtl_pres_ps
         WHERE PRD_NAM IS NOT NULL;`,
      [],
    )
      .then(formatPresManageSelect)
      .then(result => {
        res.status(200).json(result);
      });
  },

  scheduleGet(req, res, next) {
    mysql.executeQuery(
      `SELECT * FROM viw_wtt_sch_address;`,
      [],
    )
      .then(formatScheduleSelect)
      .then(result => {
        res.status(200).json(result);
      });
  },

  scheduleMemoGet(req, res, next) {
    mysql.executeQuery(
      `SELECT * FROM wtt_sch_memo;`,
      [],
    )
      .then(result => {
        res.status(200).json(result);
      });
  },

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
         VALUES (DEFAULT, ST_SetSRID(ST_MakePoint($1, $2), 5187), $1, $2, dj_yearly_counter(), $3, $4, $5,
                 $6, $7, (SELECT codeno FROM private.cd_apy WHERE cname = $8), $9,
                 (SELECT codeno FROM private.cd_lep WHERE cname = $10), $11, $12, $13,
                 (SELECT codeno FROM private.cd_pro WHERE cname = $14), NULL, NULL, $15, $16, DEFAULT);`,
      [
        _body['x'],
        _body['y'],
        _body['rcv_ymd'],
        _body['rcv_nam'],
        _body['apl_hjd'],
        _body['apl_adr'],
        _body['apl_exp'],
        _body['apy_cde'],
        _body['pip_dip'],
        _body['lep_cde'],
        _body['apm_nam'],
        _body['apm_adr_jibun'] + '/' + _body['apm_adr_road'] + ' ' + _body['apm_adr_desc'],
        _body['apm_tel'],
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
      .then(formatSearchSelect)
      .then(result => {
        res.status(200).json(result);
      });
  },
};

function formatPresManageSelect(response) {
  return {
    iTotalRecords: response.length,
    iTotalDisplayRecords: 5,
    sEcho: 0,
    aaData: response,
  };
}

function formatScheduleSelect(response) {
  let records = {
    iTotalDisplayRecords: 5,
    sEcho: 0,
  };
  response = response.filter(record => record['CK'] === '1');
  response.forEach(function (record) {
    let startDate = moment(record['비상근무기간_시작']);
    let endDate = moment(record['비상근무기간_종료']);
    record['비상근무기간_시작'] = startDate.isValid()
      ? startDate.format('YYYY.MM.DD')
      : `<small class="text-muted">기간 없음</small>`;
    record['비상근무기간_종료'] = endDate.isValid()
      ? endDate.format('YYYY.MM.DD')
      : `<small class="text-muted">기간 없음</small>`;
    record['비상근무기간'] = record['비상근무기간_시작'] + ' ~ ' + record['비상근무기간_종료'];
  });
  records['aaData'] = response;
  records['iTotalRecords'] = records.aaData.length;
  return records;
}

function formatSearchSelect(response) {
  let records = {
    iTotalRecords: response.rowCount,
    iTotalDisplayRecords: 10,
    sEcho: 0,
    aaData: response.rows,
  };
  (records.aaData).forEach(function (record) {
    record['일자'] = moment(record['일자']).format('YYYY.MM.DD');
    record['기한'] = moment(record['기한']).format('YYYY.MM.DD');
    let address = record['주소'].split('/');
    record['지번 주소'] = address[0] ? address[0].trim() : '';
    record['도로명 주소'] = address[1] ? address[1].trim() : '';
    let pos = record['누수'] ? record['누수'] + ' ' : '';
    let dip = record['관경'] ? record['관경'] + ' ' + 'mm' + ' ' : '';
    record['상세'] = pos + dip + record['상세'];
    record['관경'] = record['관경'] ? record['관경'] + ' ' + 'mm' : '';
    record['기능'] = null;
  });
  return records;
}
