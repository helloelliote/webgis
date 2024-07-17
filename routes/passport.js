import postgresql from '../middlewares/postgresql';
import bcrypt from 'bcryptjs';

export default {
  index(req, res, next) {
    res.render('signin', {
      title: '로그인 | 상수도 조회시스템',
      _csrfToken: req.csrfToken(),
    });
  },

  login(req, res, next, passport) {
    passport.authenticate('local-signin', signInUser)(req, res, next);

    function signInUser(err, user, info) {
      if (err || !user) {
        console.log('login', '로그인 실패');
        return res.status(403).json({
          message: (err && err.message) || (info && info.message) || '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.',
        });
      }
      req.login(user, function (err) {
        if (err) {
          console.log('login', '로그인 실패');
          return res.status(403).json({
            message: '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.',
          });
        } else {
          console.log('loginng');
          return res.status(200).json({
            role: req.user['RoleName'],
          });
        }
      });
    }
  },

  signUp(req, res, next, passport) {
    passport.authenticate('local-signup', signUpUser)(req, res, next);
    console.log('회원가입완료!');

    function signUpUser(err, user, info) {
      if (err) {
        console.error('Error during sign up:', err);
        return res.status(400).json({
          message: '계정 생성에 실패하였습니다. 관리자에게 문의바랍니다.',
        });
      } else {
        if (info === false) {
          return res
            .status(400)
            .json({ message: '이미 사용중인 아이디입니다.' });
        } else {
          return res.status(200).json({
            message: '등록한 계정은 관리자의 승인 후 사용이 가능합니다.',
          });
        }
      }
    }
  },

  signOut(req, res, next) {
    req.session.destroy(function (err) {
      if (err) {
        console.log('로그아웃 에러:', err);
        return next(err);
      }
      res.clearCookie('connect.sid');
      // console.log( res.clearCookie('connect.sid'),"로그아웃1")
      req.logOut(() => {
        res.redirect('/auth/signin');
      });
    });
  },

  duplicate(req, res, next) {
    const LoginName = req.body['LoginName'];
    postgresql.executeQuery(
      `SELECT username AS "LoginName"
       FROM private.sys_login
       WHERE username = $1;`,
      [LoginName],
    ).then(result => {
      res.status(200).json({ rowCount: result.rows.length });
    }).catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database query failed' });
    });
  },

  account(req, res, next) {
    postgresql.executeQuery(
      `SELECT membership_tb.userid_fk                          AS "RecordID",
              role_tb.role_name                                AS "RoleName",
              concat(user_tb.lastname, ' ', user_tb.firstname) AS "Name",
              user_tb.username                                 AS "LoginName",
              membership_tb.email                              AS "Email",
              CASE
                WHEN active = TRUE AND reset = FALSE THEN '정상'
                WHEN active = FALSE AND reset = TRUE THEN '대기'
                WHEN active = TRUE AND reset = TRUE THEN '리셋'
                ELSE '중지' END                                  AS "Status"
       FROM private.sys_login AS login_tb
              LEFT JOIN private.sys_membership AS membership_tb ON login_tb.id = membership_tb.userid_fk
              LEFT JOIN private.sys_user AS user_tb ON membership_tb.userid_fk = user_tb.id
              LEFT JOIN private.sys_role AS role_tb ON membership_tb.roleid_fk = role_tb.id
       WHERE user_tb.username != 'admin'
       ORDER BY role_tb.role_name ASC, user_tb.lastname ASC, user_tb.firstname ASC;
      `,
      [],
    ).then(result => {
      const formattedResult = formatAccountData(result);
      res.status(200).send(formattedResult);
    }).catch(next);
  },

  update(req, res, next) {
    const post = req.body;
    const queries = [];
    const values = [];
    post.forEach(function (element) {
      if (element.active === undefined || element.reset === undefined) {
        queries.push(`
          UPDATE private.sys_membership AS membership_tb
          SET roleid_fk = $2
          WHERE membership_tb.userid_fk = $1;
        `);
        values.push([element['irandomized'], element['newValue']]);
      } else {
        queries.push(`
          UPDATE private.sys_membership AS membership_tb
          SET active = $2,
              reset  = $3
          WHERE membership_tb.userid_fk = $1;
        `);
        values.push([element['id'], element['active'], element['reset']]);
      }
    });
    postgresql.executeTransaction(queries, values)
      .then(results => {
        console.log(results, 'check2');
        res.status(200).send(results);
      })
      .catch(err => {
        console.error(err, 'errcheck');
        res.status(400).json(err);
      });
  },

  delete(req, res, next) {
    const id = req.body[0].id;
    console.log(id, 'slowly');

    const queries = [
      {
        text: `DELETE
               FROM private.sys_login AS login_tb
               WHERE login_tb.userid_fk = $1
                 AND login_tb.username != 'admin';`,
        values: [id],
      },
      {
        text: `DELETE
               FROM private.sys_membership AS membership_tb
               WHERE membership_tb.userid_fk = $1`,
        values: [id],
      },
      {
        text: `DELETE
               FROM private.sys_user AS user_tb
               WHERE user_tb.id = $1
                 AND user_tb.username != 'admin';`,
        values: [id],
      },
    ];

    const queryPromises = queries.map(query => postgresql.executeQuery(query));

    Promise.all(queryPromises)
      .then(results => {
        res.status(200).send(results);
      })
      .catch(err => {
        console.error(err, 'errchecking');
        res.status(400).json(err);
      });
  },

  resetKey(req, res, next) {
      postgresql.executeQuery(
        `SELECT login_tb.username AS "LoginName", login_tb.password AS "LoginKey"
         FROM private.sys_login AS login_tb WHERE login_tb.username = $1;`, [req.body['OldLoginName']],
      ).then(function (result) {
        if (result.rowCount === 0) {
          return res.status(400).json({
            message: '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.'
          });
        } else {
          bcrypt
            .compare(req.body['OldLoginKey'], result.rows[0]['LoginKey'])
            .then(function (match) {
              if (match) {
                onChangePassword(req, res);
              } else {
                return res.status(401).json({
                  message: '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.'
                });
              }
            });
        }
      })
        .catch(function (err) {
          res.status(400).json({
            message: '비밀번호 변경에 실패하였습니다. 관리자에게 문의바랍니다.',
          });
        });
  },
};

export function onChangePassword(req, res) {
  bcrypt.hash(req.body['NewLoginKey'], 10, function (err, hash) {
    postgresql.executeQuery(
      `UPDATE private.sys_login AS login_tb
       SET password = $1
       WHERE login_tb.username = $2;`, [hash, req.body['OldLoginName']],
    ).then(function (result) {
      if (result.rowCount === 1) {
        res.status(200).send();
      } else {
        res.status(400).json({
          message:
            '비밀번호 변경에 실패하였습니다. 관리자에게 문의바랍니다.',
        });
      }
    })
      .catch(function (err) {
        res.status(400).json({
          message: '비밀번호 변경에 실패하였습니다. 관리자에게 문의바랍니다.',
        });
      })
  });
}

export function checkAdmin(req, res, next) {
  if (!req.isAuthenticated() && req.user['LoginName'] !== 'admin') {
    res.status(401).send();
  } else {
    next();
  }
}

export function formatAccountData(rawData) {
  const rows = rawData.rows;
  const total = rawData.rowCount;
  const dataSet = {
    meta: {
      page: 1,
      pages: Math.ceil(total / 10),
      perpage: 10,
      total: total,
      sort: 'asc',
      field: 'name',
    },
    data: [],
  };
  for (var i = 0, len = rawData.rowCount; i < len; i++) {
    dataSet.data[i] = rows[i];
  }
  return JSON.stringify(dataSet);
}
