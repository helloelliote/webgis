import { Style } from 'ol/style';
import { default as MapObject } from '../../Object';
import { default as MapError } from '../../Error';
import { default as config } from './style.config';

Style.prototype.setLabel = function (value) {
  this.getText().setText(value);
};

export default class StyleMap extends MapObject {

  constructor(options) {
    if (!options['identifier'] || !options['styleFunction']) {
      throw new MapError();
    }
    super();

    const styleEntries = new Map(Object.entries(config[options['identifier']]));

    const styleFunctions = options['styleFunction'];

    for (let [key, value] of styleEntries) {
      this[key] = styleFunctions(value);
    }
  }
}
