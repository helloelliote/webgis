'use strict';

import { setAbstract } from '../../map/Util';
import { default as MapError } from '../../map/Error';

describe('map.Util', () => {
  describe('#setAbstract()', () => {

    class ParentClass {
      constructor() {
      }

      getAge() {
        setAbstract();
      }
    }

    class ChildClass extends ParentClass {
      constructor() {
        super();
      }

      /**
       * @override
       */
      getAge() {
        return 12;
      }
    }

    test('calling abstract function throws an error', () => {
      const parent = new ParentClass();
      expect(() => {parent.getAge();}).toThrow(MapError);
    });

    test('...and must override', () => {
      const child = new ChildClass();
      expect(child.getAge()).toBe(12);
    });
  });
});