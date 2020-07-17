'use strict';

import { default as MapError } from '../../map/Error';

describe('map.Error', () => {
  test('is instanceof Error', () => {
    const error = new MapError();
    expect(error).toBeInstanceOf(Error);
  });
});
