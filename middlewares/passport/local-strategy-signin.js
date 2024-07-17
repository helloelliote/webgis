import passportLocal from 'passport-local';
import postgresql from '../postgresql/index';
import bcrypt from 'bcryptjs';

function onPassportLocalSignIn(req, username, password, done) {
  const sqlSelectUsernameAndStatus = `
      SELECT user_tb.username     AS "LoginName",
             membership_tb.active AS "Status"
      FROM private.sys_login AS login_tb
               LEFT JOIN private.sys_user AS user_tb ON login_tb.userid_fk = user_tb.id
               LEFT JOIN private.sys_membership AS membership_tb ON user_tb.id = membership_tb.userid_fk
      WHERE login_tb.username = $1
      LIMIT 1
  `;

  postgresql
    .executeQuery(sqlSelectUsernameAndStatus, [username])
    .then(isNotNull)
    .then(isActivatedUser)
    .then(onAuthenticateUser)
    .catch((err) => {
      console.error('Database query error:', err);
      return done(null, false, { message: err.message || 'Internal server error' });
    });

  function isNotNull(result) {
    if (!result || result.rowCount === 0) {
      throw new Error('등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.');
    } else {
      return result;
    }
  }

  function isActivatedUser(result) {
    if (result.rows[0]['Status'] === false) {
      throw new Error('관리자의 사용 승인이 필요한 계정입니다.');
    } else {
      return result;
    }
  }
  function onAuthenticateUser() {
    const sqlSelectUserInfo = `
        SELECT login_tb.username       AS "LoginName",
               login_tb.password       AS "LoginKey",
               user_tb.lastname        AS "UserLastName",
               user_tb.firstname       AS "UserFirstName",
               role_tb.role_name       AS "RoleName",
               company_tb.company_name AS "CompanyName",
               company_tb.wtl          AS "CompanyWTL",
               company_tb.swl          AS "CompanySWL"
        FROM private.sys_login AS login_tb
                 LEFT JOIN private.sys_user AS user_tb ON login_tb.userid_fk = user_tb.id
                 LEFT JOIN private.sys_membership AS membership_tb ON user_tb.id = membership_tb.userid_fk
                 LEFT JOIN private.sys_role AS role_tb ON membership_tb.roleid_fk = role_tb.id
                 LEFT JOIN private.sys_company AS company_tb ON membership_tb.companyid_fk = company_tb.id
        WHERE login_tb.username = $1
    `;

    postgresql.executeQuery(sqlSelectUserInfo, [username])
      .then(onBcryptCompare)
      .catch((err) => {
        console.error('Database query error:', err);
        return done(null, false, { message: '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.' });
      })
      .finally(() => {
        console.log('User authentication query finished.');
      });

    function onBcryptCompare(result) {
      if (!result || result.rowCount === 0) {
        throw new Error('등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.');
      }
      const signIn = result.rows[0];
      bcrypt
        .compare(password, signIn['LoginKey'])
        .then(function (isMatch) {
          if (isMatch) {
            return done(null, {
              UserName: `${signIn['UserLastName']}${signIn['UserFirstName']}`,
              LoginName: signIn['LoginName'],
              CompanyName: signIn['CompanyName'],
              RoleName: signIn['RoleName'],
              CompanyWTL: signIn['CompanyWTL'],
              CompanySWL: signIn['CompanySWL'],
            });
          } else {
            throw new Error('등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.');
          }
        })
        .catch(function (err) {
          console.error('Bcrypt comparison error:', err);
          return done(null, false, { message: '등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.' });
        })
        .finally(() => {
          console.log('Bcrypt comparison finished.');
        });
    }
  }
}

export default new passportLocal.Strategy(
  {
    usernameField: 'LoginName',
    passwordField: 'LoginKey',
    passReqToCallback: true,
  },
  onPassportLocalSignIn);
