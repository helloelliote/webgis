import { default as MapObject } from '../../Object';
import MapError from '../../Error';
import LayerGroup from 'ol/layer/Group';
import Collection from 'ol/Collection';

export default class Layer extends MapObject {

  constructor(options) {
    super(options);

    this._layerMap = new Map();

    this._layerGroup = new LayerGroup();

    this._updateLayerGroup = function () {
      this._layerGroup.setLayers(
        new Collection([...this._layerMap.values()]),
      );
    };
  }

  get keys() {
    return this._layerMap.keys();
  }

  get layers() {
    return this._layerGroup;
  }

  getLayer(key) {
    if (this._layerMap.has(key)) {
      return this._layerMap.get(key);
    } else {
      throw new MapError();
    }
  }

  clearLayers() {
    this._layerMap.clear();
    this._updateLayerGroup();
  }
  
  toggleLayers(keyArray, layerCreatorFunction) {
    if (!(keyArray instanceof Array)) {
      throw new MapError();
    }
    keyArray.forEach(function (key) {
      if (this._layerMap.has(key)) {
        this._layerMap.delete(key);
        // TODO: #removeClass from aside menu
      } else {
        let newLayer = layerCreatorFunction(key);
        this._layerMap.set(key, newLayer);
        // TODO: #addClass from aside menu
      }
    }, this);
    this._updateLayerGroup();
  }
}
