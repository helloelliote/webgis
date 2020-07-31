import { default as Postgresql } from '../../middlewares/postgresql';
import { Pool as PostgresqlPool } from 'pg';

let postgresqlOne;
let postgresqlTwo;

beforeAll(() => {
  // TODO: Fill up database connection credentials
  process.env.PGHOST='';
  process.env.PGPORT='';
  process.env.PGUSER='';
  process.env.PGPASSWORD='';
  process.env.PGDATABASE='';

  postgresqlOne = new Postgresql();
  postgresqlTwo = new Postgresql();
});

afterAll(() => {
  postgresqlOne.end();
});

describe('middlewares.Postgresql', () => {
  test('Is singleton pattern', () => {
    expect(postgresqlOne).toStrictEqual(postgresqlTwo);
  });
});

describe('#pool()', () => {
  test('returns connection pool', () => {
    expect(postgresqlOne.pool).toBeInstanceOf(PostgresqlPool);
  });
});

describe('#executeQuery()', () => {
  test('works with promises', () => {
    expect.assertions(1);
    return postgresqlOne
      .executeQuery(`SELECT 1;`, null)
      .then(result => {
        expect(result).toEqual([{ '?column?': 1 }]);
      });
  });
});
