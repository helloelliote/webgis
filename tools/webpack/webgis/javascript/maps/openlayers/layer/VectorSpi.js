import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { createDefaultStyle } from 'ol/style/Style';
import Layer from './Layer';
import property from './Layer.property';
import SourceLoader from '../worker/sourceLoader.worker';
import { default as FeatureFilter } from '../feature/filter';
import { geoJsonWGS } from '../format';
import GeometryType from 'ol/geom/GeometryType';
import { pointSpiStyleMap } from '../style';
import { layerSelectFilter } from '../filter';

export default class VectorSpi extends Layer {

  constructor(props) {
    super(props);

    if (window.webgis.table.filter) {
      FeatureFilter.init(this);
    }
  }

  toggleLayers(keyArray) {
    super.toggleLayers(keyArray, createVectorSpiLayer);
  }
}

function createVectorSpiLayer(key) {
  const vectorSpiLayer = new VectorLayer({
    maxZoom: property[key].maxZ,
    minZoom: property[key].minZ,
    source: key.includes('filter') ? new VectorSource() : createVectorSpiSource(key),
    style: createVectorSpiStyle,
  });
  if (!layerSelectFilter.has(key)) {
    vectorSpiLayer.set('selectable', true, true);
  }
  return vectorSpiLayer;
}

function createVectorSpiSource(key) {
  const vectorSpiSource =
    new VectorSource(({
      format: geoJsonWGS,
      overlaps: false,
      loader: function (extent, resolution, projection) {
        const url = createVectorSpiSourceRequestUrl(key);
        const sourceLoader = new SourceLoader();
        sourceLoader.postMessage(url);
        sourceLoader.onerror = error => {
          vectorSpiSource.removeLoadedExtent(extent);
        };
        sourceLoader.onmessage = response => {
          (async () => {
            vectorSpiSource.addFeatures(vectorSpiSource.getFormat().readFeatures(response.data));
          })()
            .catch(() => {
              // TODO: Error Handling
            })
            .finally(() => {
              sourceLoader.terminate();
            });
        };
      },
    }));
  return vectorSpiSource;
}

// noinspection HttpUrlsUsage
function createVectorSpiSourceRequestUrl(key) {
  const requestParams = {
    typename: `spi:${key}`,
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
  };
  const requestUrl = Object
    .entries(requestParams)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  return `${window.webgis.geoserverHost}/geoserver/spi/wfs?${requestUrl}`;
}


export function createVectorSpiStyle(feature) {
  const layer = (feature.get('pipe') || '기타관로').trim();
  switch (feature.getGeometry().getType()) {
    case GeometryType.POINT: {
      return pointSpiStyleMap[layer];
    }
    default: {
      return createDefaultStyle(feature, 0);
    }
  }
}
