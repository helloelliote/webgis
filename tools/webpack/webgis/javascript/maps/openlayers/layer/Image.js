import { Image as ImageLayer } from 'ol/layer';
import { ImageWMS } from 'ol/source';
import Layer from './Layer';
import property from './Layer.property';

export default class Image extends Layer {

  constructor(options) {
    super(options);
  }

  toggleLayers(keyArray) {
    super.toggleLayers(keyArray, createImageLayer);
  }
}

function createImageLayer(key) {
  return new ImageLayer({
    maxZoom: property[key].maxZ,
    minZoom: property[key].minZ,
    source: createImageSource(key),
  });
}

function createImageSource(key) {
  return new ImageWMS({
    url: createImageSourceRequestUrl(),
    hidpi: false,
    imageSmoothing: false,
    params: {
      FORMAT: 'image/svg',
      LAYERS: `${window.webgis.workspace}:${key}`,
      STYLES: null,
      TILED: false,
      VERSION: '1.1.1',
    },
    ratio: 1,
  });
}

function createImageSourceRequestUrl() {
  return `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/wms`;
}
