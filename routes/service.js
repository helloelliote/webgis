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
    ).then(formatPresManageSelect).then(result => {
      res.status(200).json(result);
    }).catch(next);
  },

  scheduleGet(req, res, next) {
    mysql.executeQuery(
      `SELECT * FROM viw_wtt_sch_address;`,
      [],
    ).then(formatScheduleSelect).then(result => {
      res.status(200).json(result);
    }).catch(next);
  },

  scheduleMemoGet(req, res, next) {
    mysql.executeQuery(
      `SELECT * FROM wtt_sch_memo;`,
      [],
    ).then(result => {
      res.status(200).json(result);
    }).catch(next);
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
    }).catch(next);
  },

  registerPost(req, res, next) {
    const _body = req.body;
    postgresql.executeQuery(
      `INSERT INTO wtt_wser_ma
         VALUES (DEFAULT, ST_SetSRID(ST_MakePoint($1, $2), 5187), $1, $2, dj_yearly_counter(), $3, $4, $5,
                 $6, $7, (SELECT codeno FROM private.cd_apy WHERE cname = $8), $9,
                 (SELECT codeno FROM private.cd_lpy WHERE cname = $10), $11, $12, $13,
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
    }).catch(next);
  },

  searchGet(req, res, next) {
    res.render('service-search', {
      _csrfToken: req.csrfToken(),
      title: '민원검색 |', // TODO: Fill in user organisation name
    });
  },

  searchPost(req, res, next) {
    let sqlStatement;
    let formatter = response => response;
    switch (req.query['api']) {
      case undefined: {
        sqlStatement = `SELECT * FROM viw_wtt_wser_ma WHERE 삭제 IS NULL;`;
        formatter = formatSearchSelect;
        break;
      }
      case 'prof': {
        const ids = req.body['id[]'].toString();
        sqlStatement = `UPDATE wtt_wser_ma SET pro_cde = 'PRO900' WHERE rcv_num IN ( ${ids} );`;
        break;
      }
      case 'prod': {
        const ids = req.body['id[]'].toString();
        sqlStatement = `UPDATE wtt_wser_ma SET del_ymd = CURRENT_TIMESTAMP WHERE rcv_num IN ( ${ids} );`;
        break;
      }
      default: {
        break;
      }
    }
    // TODO: '상수' Role 처리
    postgresql.executeQuery(sqlStatement, [])
      .then(formatter)
      .then(result => {
        res.status(200).json(result);
      }).catch(next);
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
    record['일자'] = moment(record['일자']).format('MM/DD/YYYY');
    record['기한'] = moment(record['기한']).format('MM/DD/YYYY');
    let address = record['주소'].split('/');
    record['지번 주소'] = address[0] ? address[0].trim() : '';
    record['도로명 주소'] = address[1] ? address[1].trim() : '';
    let pos = record['누수'] ? record['누수'] + ' ' : '';
    let dip = record['관경'] ? record['관경'] + ' ' + 'mm' + ' ' : '';
    record['상세'] = pos + dip + record['상세'];
    record['관경'] = record['관경'] ? record['관경'] + ' ' + 'mm' : '';
    record['Button1'] = null;
  });
  return records;
}
