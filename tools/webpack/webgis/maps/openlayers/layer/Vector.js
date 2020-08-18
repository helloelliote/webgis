import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import SourceLoader from '../worker/sourceLoader.worker';

function createVectorLayer(name) {
  return new VectorLayer({
    className: name,
    maxZoom: 19,
    minzoom: 9,
    source: createVectorSource(name),
    // style: TODO: A style function
  });
}

function createVectorSource(name) {
  const vectorSource = 
    new VectorSource({
      format: '',
      overlaps: false,
      loader: function (extent, resolution, projection) {
        const url = createVectorSourceRequestUrl(name);
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

function createVectorSourceRequestUrl(name) {
  const requestParams = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    typename: ``, // TODO: Add config
    propertyName: ``, // TODO: Add config
  };
  const requestUri = Object
    .entries(requestParams)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  return ``; // TODO: Return requestUri along with config
}

export default createVectorLayer;
