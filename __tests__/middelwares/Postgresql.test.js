import { default as postgresql } from '../../middlewares/postgresql';
import { Pool } from 'pg';

afterAll(() => {
  postgresql.pool.end();
});

describe('#pool()', () => {
  test('returns connection pool', () => {
    expect(postgresql.pool).toBeInstanceOf(Pool);
  });
});

describe('#executeQuery()', () => {
  test('works with promises', () => {
    expect.assertions(1);
    return postgresql
      .executeQuery(`SELECT 1;`, null)
      .then(result => {
        expect(result.rows).toEqual([{ '?column?': 1 }]);
      });
  });

  test('returns Error code rather than Error object itself', () => {
    expect.assertions(1);
    return postgresql
      .executeQuery(`INVALID QUERY;`, null)
      .then(result => {
        expect(result).toBeInstanceOf(Error);
      });
  });
});
