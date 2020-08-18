import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import TileState from 'ol/TileState';
import SourceLoader from '../worker/sourceLoader.worker';

function createTileLayer(name) {
  return new TileLayer({
    className: name,
    maxZoom: 19,
    minZoom: 15,
    source: createTileSource(name),
  });
}

function createTileSource(name) {
  return new TileWMS({
    url: createTileSourceRequestUrl(name),
    hidpi: false,
    params: {
      FORMAT: 'image/png',
      // LAYERS: ``, // TODO: Workspace 들어간 url
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
        tileSource.setState(TileState.ERROR);
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

function createTileSourceRequestUrl(name) {
  const host = '';
  return ``; // TODO: Workspace 들어간 url
}

export default createTileLayer;
