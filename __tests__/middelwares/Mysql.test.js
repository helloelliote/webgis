import { default as Mysql } from '../../middlewares/mysql';
import { Pool as MysqlPool } from 'mysql2';

let mysqlOne;
let mysqlTwo;

beforeAll(() => {
  // TODO: Fill up database connection credentials
  process.env.MSHOST='';
  process.env.MSPORT='';
  process.env.MSUSER='';
  process.env.MSPASSWORD='';
  process.env.MSDATABASE='';

  mysqlOne = new Mysql();
  mysqlTwo = new Mysql();
});

describe('middlewares.Mysql', () => {
  test('Is singleton pattern', () => {
    expect(mysqlOne).toStrictEqual(mysqlTwo);
  });
});

describe('#pool()', () => {
  test('returns connection pool', () => {
    expect(mysqlOne.pool).toBeInstanceOf(MysqlPool);
  });
});

describe('#executeQuery()', () => {
  test('works with promises', () => {
    expect.assertions(1);
    return mysqlOne
      .executeQuery(`SELECT 1;`, null)
      .then(result => {
        expect(result).toEqual([{ '1': 1 }]);
      });
  });
});
