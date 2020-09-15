import { default as MapObject } from '../../Object';
import { default as MapError } from '../../Error';
import { default as config }  from './style.config';

export default class StyleMap extends MapObject {

  constructor(options) {
    if (!options['identifier'] || !options['styleFunction']) {
      throw new MapError();
    }
    super(options);

    const styleEntries = Object.entries(config[options['identifier']]);

    this._map = new Map();

    for (const [key, value] of styleEntries) {
      this._map.set(key, options['styleFunction'](value));
    }
  }
  
  get(key) {
    return this._map.get(key);
  }
}
