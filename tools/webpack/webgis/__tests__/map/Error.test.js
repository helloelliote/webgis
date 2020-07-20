'use strict';

import { default as MapError } from '../../maps/Error';

describe('map.Error', () => {
  test('is instanceof Error', () => {
    const error = new MapError();
    expect(error).toBeInstanceOf(Error);
  });
});
