import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import Layer from './Layer';
import SourceLoader from '../worker/sourceLoader.worker';

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
    maxZoom: 19,
    minZoom: 15,
    source: createTileSource(key),
  });
}

function createTileSource(key) {
  return new TileWMS({
    url: createTileSourceRequestUrl(),
    hidpi: false,
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
    tileLoadFunction: function (tileSource, src) {
      const sourceLoader = new SourceLoader();
      sourceLoader.postMessage(src);
      sourceLoader.onerror = error => {
        tileSource.setState(3);
      };
      sourceLoader.onmessage = response => {
        (async () => {
          tileSource.getImage().src = URL.createObjectURL(response.data);
        })()
          .catch(() => {
            // TODO: Error Handling
          })
          .finally(() => {
            // sourceLoader.terminate() // TODO: Check if #terminate() is really safe for tile loading
          });
      };
    },
  });
}

function createTileSourceRequestUrl() {
  return `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/wms`;
}
