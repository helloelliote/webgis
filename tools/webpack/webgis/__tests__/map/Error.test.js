'use strict';

import { default as MapError } from '../../maps/Error';

describe('map.Error', () => {
  test('is an instanceof Error', () => {
    const error = new MapError();
    expect(error).toBeInstanceOf(Error);
  });
});
