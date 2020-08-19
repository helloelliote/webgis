import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Layer from './Layer';
import SourceLoader from '../worker/sourceLoader.worker';
import property from './Layer.property';
import { default as geoJson } from '../format';

export default class Vector extends Layer {

  constructor(options) {
    super(options);
  }

  toggleLayers(keyArray) {
    super.toggleLayers(keyArray, createVectorLayer);
  }
}

function createVectorLayer(key) {
  return new VectorLayer({
    className: key,
    maxZoom: property[key].maxZ,
    minZoom: 9,
    source: createVectorSource(key),
    // style: TODO: A style function
  });
}

function createVectorSource(key) {
  const vectorSource = 
    new VectorSource({
      format: geoJson,
      overlaps: false,
      loader: function (extent, resolution, projection) {
        const url = createVectorSourceRequestUrl(key);
        const sourceLoader = new SourceLoader();
        sourceLoader.postMessage(url);
        sourceLoader.onerror = error => {
          vectorSource.removeLoadedExtent(extent);
        };
        sourceLoader.onmessage = response => {
          (async () => {
            vectorSource.addFeatures(vectorSource.getFormat().readFeatures(response.data));
          })()
            .catch(() => {
              // TODO: Error Handling
            })
            .finally(() => {
              sourceLoader.terminate();
            });
        };
      },
    });
  return vectorSource;
}

function createVectorSourceRequestUrl(key) {
  const requestParams = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    typename: `${window.webgis.workspace}:${key}`,
    propertyName: `${property[key].propertyName}`,
  };
  const requestUrl = Object
    .entries(requestParams)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  return `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/wfs?${requestUrl}`;
}
