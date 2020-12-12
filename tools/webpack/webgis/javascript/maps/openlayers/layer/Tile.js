import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import Layer from './Layer';

export default class WmsTile extends Layer {

  constructor(options) {
    super(options);
  }

  toggleLayers(keyArray) {
    super.toggleLayers(keyArray, createTileLayer);
  }
}

function createTileLayer(key) {
  return new TileLayer({
    className: key,
    maxZoom: 21,
    minZoom: 15,
    source: createTileSource(key),
  });
}

function createTileSource(key) {
  return new TileWMS({
    url: createTileSourceRequestUrl(),
    hidpi: true,
    params: {
      FORMAT: 'image/png',
      LAYERS: `${window.webgis.workspace}:${key}`,
      STYLES: null,
      TILED: false,
      VERSION: '1.1.1',
    },
    reprojectionErrorThreshold: 50.0,
    transition: 0,
    wrapX: false,
  });
}

function createTileSourceRequestUrl() {
  return `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/wms`;
}