import { default as MapObject } from '../../Object';
import MapError from '../../Error';

export default class Layer extends MapObject {

  constructor(options) {
    super(options);

    this._layerMap = new Map();
  }

  get keys() {
    return this._layerMap.keys();
  }

  get layers() {
    return this._layerMap.values();
  }

  addLayer(key, layer) {
    this._layerMap.set(key, layer);
  }

  removeLayer(key) {
    this._layerMap.delete(key);
  }

  getLayer(key) {
    if (this._layerMap.has(key)) {
      return this._layerMap.get(key);
    } else {
      throw new MapError();
    }
  }
  
  toggleLayers(keyArray, layerCreatorFunction) {
    if (!(keyArray instanceof Array)) {
      throw new MapError();
    }
    let that = this;
    keyArray.forEach(function (key) {
      if (that._layerMap.has(key)) {
        that._layerMap.delete(key);
      } else {
        let newLayer = layerCreatorFunction(key);
        that._layerMap.set(key, newLayer);
      }
    });
  }
}
