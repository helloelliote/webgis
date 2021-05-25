import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeometryType from 'ol/geom/GeometryType';
import { Point } from 'ol/geom';
import { createDefaultStyle } from 'ol/style/Style';
import Layer from './Layer';
import property from './Layer.property';
import SourceLoader from '../worker/sourceLoader.worker';
import { default as FeatureFilter } from '../feature/filter';
import { geoJson } from '../format';
import { arrowheadStyle, closedPipeStyle, lineStyleMap, pointStyleMap, polygonStyleMap } from '../style';
import { layerSelectFilter, styleDirectionFilter, styleRotationFilter } from '../filter';

export default class Vector extends Layer {

  constructor(options) {
    super(options);

    if (window.webgis.table.filter) {
      FeatureFilter.init(this);
    }
  }

  toggleLayers(keyArray) {
    super.toggleLayers(keyArray, createVectorLayer);
  }
}

function createVectorLayer(key) {
  const vectorLayer = new VectorLayer({
    maxZoom: property[key].maxZ,
    minZoom: property[key].minZ,
    source: key.includes('filter') ? new VectorSource() : createVectorSource(key),
    style: createVectorStyle,
  });
  if (!layerSelectFilter.has(key)) {
    vectorLayer.set('selectable', true, true);
  }
  return vectorLayer;
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
    typename: `${window.webgis.workspace}:${key}`,
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
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

export function createVectorStyle(feature) {
  let layer =
    feature.get('레이어') ||
    feature.get('layer') ||
    feature.getId().match(/[^.]+/)[0];
  if (!layer) {
    return createDefaultStyle(feature, 0);
  }
  layer = layer.trim();
  switch (feature.getGeometry().getType()) {
    case GeometryType.LINE_STRING: {
      if (feature.get('폐관일자')) {
        return closedPipeStyle;
      }
      const lineStyle = lineStyleMap[layer];
      if (layer === '가정급수관' || layer === 'swl_hmpipe_ls') {
        lineStyle.setLabel(null);
      } else {
        lineStyle.setLabel(feature.get('관라벨'));
      }
      if (!styleDirectionFilter.has(layer)) {
        return lineStyle;
      }
      let lineSegments = [];
      const _arrowheadStyle = arrowheadStyle[layer];
      feature.getGeometry().forEachSegment(function (start, end) {
        _arrowheadStyle.setGeometry(new Point(end));
        _arrowheadStyle.getImage().setRotation(fromPoints(start, end, false));
        lineSegments.push(_arrowheadStyle);
      });
      return [lineStyle, lineSegments.pop()];
    }
    case GeometryType.MULTI_LINE_STRING: {
      if (feature.get('폐관일자')) {
        return closedPipeStyle;
      }
      const lineStyle = lineStyleMap[layer];
      if (layer === '가정급수관' || layer === 'swl_hmpipe_ls') {
        lineStyle.setLabel(null);
      } else {
        lineStyle.setLabel(feature.get('관라벨'));
      }
      return lineStyle;
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      let pointStyle = pointStyleMap[layer];
      // noinspection JSNonASCIINames,FallThroughInSwitchStatementJS
      switch (layer) {
        case '경계변':
        case '제수변':
        case '지수전': {
          const valveState = feature.get('개폐여부');
          if (valveState === '개' || valveState === '미분류') {
            break;
          }
          pointStyle = pointStyleMap[`${layer}_${valveState}`];
          break;
        }
        case '가압장':
        case '배수지':
        case '취수장': {
          pointStyle.setLabel(feature.get(`${layer}명`));
          break;
        }
        case '블럭유량계':
          pointStyle.setLabel(feature.get('유량계명칭'));
          break;
        case '오수받이': {
          if (feature.get('EDDATE') && feature.get('관리기관') === '환경사업소') {
            pointStyle = pointStyleMap['오수받이_영천환경사업소'];
          }
          break;
        }
        case '펌프시설':
        case '하수펌프장': {
          pointStyle.setLabel(feature.get('하수펌프장명'));
          break;
        }
        case '하수처리장': {
          pointStyle.setLabel(feature.get('하수처리장명'));
          break;
        }
        case 'viw_wtl_prme_ps':
        case 'viw_wtl_userlabel_ps': {
          pointStyle.setLabel(feature.get('주기명'));
          break;
        }
        default:
          break;
      }
      if (styleRotationFilter.has(layer) && feature.get('방향각') !== undefined) {
        pointStyle.getImage().setRotation(
          fromDegree(
            // CS(=MySql)의 방향각은 왼쪽 회전이 기본이며, ol 은 오른쪽회전이 기본임
            feature.get('방향각').toString(),
            false,
          ),
        );
      }
      return pointStyle;
    }
    case GeometryType.POLYGON:
    case GeometryType.MULTI_POLYGON: {
      const polygonStyle = polygonStyleMap[layer];
      switch (layer) {
        case '가압장':
        case '배수지':
        case '정수장':
        case '하수처리장': {
          polygonStyle.setLabel(feature.get(`${layer}명`));
          break;
        }
        case 'viw_bml_badm_as':
          polygonStyle.setLabel(feature.get('법정동'));
          break;
        case 'viw_bml_hadm_as':
          polygonStyle.setLabel(feature.get('행정동'));
          break;
        case 'viw_wtl_userlabel_as':
          polygonStyle.setLabel(feature.get('주기명'));
          break;
        case 'viw_wtl_wtsa_as':
          polygonStyle.setLabel(feature.get('급수구역명'));
          break;
        case 'viw_wtl_wtssa_as':
          polygonStyle.setLabel(feature.get('급수분구명'));
          break;
        case 'viw_wtl_wtsba_as':
          polygonStyle.setLabel(feature.get('급수블럭명'));
          break;
        case 'viw_swl_aodr_as':
          polygonStyle.setLabel(feature.get('배수구역명'));
          break;
        case 'viw_swl_dodr_as':
          polygonStyle.setLabel(feature.get('배수분구명'));
          break;
        case 'viw_swl_aodp_as':
          polygonStyle.setLabel(feature.get('처리구역명'));
          break;
        case 'viw_swl_dodp_as':
          polygonStyle.setLabel(feature.get('처리분구명'));
          break;
        default:
          break;
      }
      return polygonStyle;
    }
    default: {
      return createDefaultStyle(feature, 0);
    }
  }
}

// To convert radians to degrees, divide by (Math.PI / 180). Multiply by this to convert the other way.
function fromDegree(degree, clockwise = true) {
  return degree * 0.01745 * (clockwise ? 1 : -1);
}

// The angle in radians between the positive x-axis and the ray from (0,0) to the point.
function fromPoints(start, end, clockwise = true) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  return Math.atan2(dy, dx) * (clockwise ? 1 : -1);
}
