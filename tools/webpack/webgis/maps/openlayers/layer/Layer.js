import { default as MapObject } from '../../Object.js';
import { default as createVectorLayer } from './Vector';
import { default as createTileLayer } from './Tile';
import MapError from '../../Error';

export default class Layer extends MapObject {

  constructor(options) {
    super(options);

    this._layerCollectionMap = new Map();
  }

  addLayer(key, layer) {
    this._layerCollectionMap.set(key, layer);
  }

  removeLayer(key) {
    this._layerCollectionMap.delete(key);
  }

  getLayer(key) {
    if (this._layerCollectionMap.has(key)) {
      return this._layerCollectionMap.get(key);
    } else {
      throw new MapError();
    }
  }
  
  toggleLayers(keyArray) {
    if (!(keyArray instanceof Array)) {
      throw new MapError();
    }
    let that = this;
    keyArray.forEach(function (key) {
      if (that._layerCollectionMap.has(key)) {
        that._layerCollectionMap.delete(key);
      } else {
        let newLayer = createVectorLayer(key); // TODO: Or, call #createTileLayer(key)
        that._layerCollectionMap.set(key, newLayer);
      }
    });
  }
}
