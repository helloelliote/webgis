import { default as mysql } from '../../middlewares/mysql';
import { Pool as MysqlPool } from 'mysql2';

describe('#pool()', () => {
  test('returns connection pool', () => {
    expect(mysql.pool).toBeInstanceOf(MysqlPool);
  });
});

describe('#executeQuery()', () => {
  test('works with promises', () => {
    expect.assertions(1);
    return mysql
      .executeQuery(`SELECT 1;`, null)
      .then(result => {
        expect(result).toEqual([{ '1': 1 }]);
      });
  });

  test('returns Error code rather than Error object itself', () => {
    expect.assertions(1);
    return mysql
      .executeQuery(`INVALID QUERY;`, null)
      .then(result => {
        expect(result).toBeInstanceOf(Error);
      });
  });
});
