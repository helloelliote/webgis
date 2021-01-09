import GeometryType from 'ol/geom/GeometryType';
import { mouseActionButton, singleClick } from 'ol/events/condition';
import { Vector as VectorSource } from 'ol/source';
import { defaults as defaultInteractions, Draw, MouseWheelZoom, Select } from 'ol/interaction';
import MapError from '../Error';
import { measureResultStyle, measureStyle, selectLineStyle, selectPointStyle, selectPolygonStyle } from './style';
import {
  FeatureOverlay,
  getMeasureTooltipOverlay,
  getTooltipOverlay,
  measureTooltip,
  measureTooltipOverlay,
  resetMeasureTooltip,
  resetTooltip,
  tooltip,
  tooltipOverlay,
} from './overlay';
/**
 * For ol/Interaction/Select
 */
import { Feature } from 'ol';
import { createDefaultStyle } from 'ol/style/Style';
import { createVectorStyle } from './layer';
import { InfoModal } from './modal';
/**
 * For ol/Interaction/Draw
 */
import { Vector as VectorLayer } from 'ol/layer';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';

export default defaultInteractions({
  altShiftDragRotate: false,
  doubleClickZoom: false,
  shiftDragZoom: false,
  pinchRotate: false,
  dragPan: true,
  zoomDelta: 1,
  zoomDuration: 0,
}).extend([
  new MouseWheelZoom({
    constrainResolution: true,
    maxDelta: 1,
    duration: 0,
    // useAnchor: true 고정, Enable zooming using the mouse's location as the anchor
    useAnchor: true,
  }),
]);

export class SelectInteraction extends Select {

  constructor(options) {
    if (!options['map']) {
      throw new MapError('Map is undefined');
    }

    super({
      condition: singleClick,
      hitTolerance: 10,
      filter: function (feature, layer) {
        return layer ? layer.get('selectable') : false;
      },
      style: function (feature) {
        switch (feature.getGeometry().getType()) {
          case GeometryType.LINE_STRING:
          case GeometryType.MULTI_LINE_STRING: {
            return selectLineStyle;
          }
          case GeometryType.POINT:
          case GeometryType.MULTI_POINT: {
            return createVectorStyle(feature).clone();
          }
          case GeometryType.POLYGON:
          case GeometryType.MULTI_POLYGON: {
            let selectStyle = createVectorStyle(feature).clone();
            selectStyle.setFill(selectPolygonStyle.getFill());
            return selectStyle;
          }
          default:
            return createDefaultStyle(feature, 0);
        }
      },
    });

    this._overlay = new FeatureOverlay({
      source: new VectorSource(),
      map: options['map'],
    });

    this._overlayFeature = new Feature();

    this._infoModal = new InfoModal('#kt_chat_modal');
    this._infoModal.addInteraction(this);

    this.on('select', this.onSelectEvent);
  }

  onSelectEvent(event) {
    event.preventDefault();
    this._overlay.setOverlay(null);
    let feature = event.selected ? event.selected[0] : this.getFeatures().item(0);
    if (!feature) return;
    switch (feature.getGeometry().getType()) {
      case GeometryType.LINE_STRING:
      case GeometryType.MULTI_LINE_STRING:
        this._infoModal.setFeatureAsync(feature).then(modal => {
          modal.showModal();
        });
        break;
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        this._overlayFeature.setStyle(selectPointStyle);
        this._overlayFeature.setGeometry(feature.getGeometry());
        this._overlay.setOverlay(this._overlayFeature);
        this._infoModal.setFeatureAsync(feature).then(modal => {
          modal.showModal();
        });
        break;
      }
      case GeometryType.POLYGON:
      case GeometryType.MULTI_POLYGON: {
        this._overlayFeature.setStyle(selectPolygonStyle);
        this._overlayFeature.setGeometry(feature.getGeometry());
        this._overlay.setOverlay(this._overlayFeature);
        break;
      }
      default:
        break;
    }
  }

  addFeature(feature) {
    this._overlay.setOverlay(null);
    this.getFeatures().setAt(0, feature);
    switch (feature.getGeometry().getType()) {
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        this._overlayFeature.setStyle(selectPointStyle);
        this._overlayFeature.setGeometry(feature.getGeometry());
        this._overlay.setOverlay(this._overlayFeature);
        break;
      }
      case GeometryType.POLYGON:
      case GeometryType.MULTI_POLYGON: {
        this._overlayFeature.setStyle(selectPolygonStyle);
        this._overlayFeature.setGeometry(feature.getGeometry());
        this._overlay.setOverlay(this._overlayFeature);
        break;
      }
      default: {
        break;
      }
    }
  }
}

export class MeasureInteraction extends Draw {

  constructor(options) {
    if (!options['map']) {
      throw new MapError('Map is undefined');
    }

    const measureSource = new VectorSource();

    super({
      condition: mouseActionButton,
      source: measureSource,
      style: measureStyle,
      stopClick: true,
      type: options['type'],
    });

    this._map = options['map'];

    this._measureResultLayer = new VectorLayer({
      source: measureSource,
      style: measureResultStyle,
    });

    this._drawFeature = null;
    this._drawListener = null;

    this._tooltipMsg = '클릭하여 측정을 시작';
    this._continueLineMsg = '계속 클릭하여 거리를 측정';
    this._continuePolygonMsg = '계속 클릭하여 면적을 측정';

    this._map.addOverlay(getTooltipOverlay());
    this._map.addOverlay(getMeasureTooltipOverlay());
    this._map.addLayer(this._measureResultLayer);

    this._map.getViewport().addEventListener('mouseout', this.onMouseout);

    this._map.on('pointermove', this.onPointerMove.bind(this));

    this.on('drawstart', this.onDrawStart);

    this.on('drawend', this.onDrawEnd);
  }

  onMouseout() {
    tooltip.classList.add('hidden');
  }

  onPointerMove(event) {
    if (event.dragging) {
      return;
    }
    if (this._drawFeature) {
      const geometry = this._drawFeature.getGeometry();
      if (geometry.getType() === GeometryType.LINE_STRING) {
        this._tooltipMsg = this._continueLineMsg;
      } else {
        this._tooltipMsg = this._continuePolygonMsg;
      }
    }
    tooltip.innerHTML = this._tooltipMsg;
    tooltip.classList.remove('hidden');
    tooltipOverlay.setPosition(event.coordinate);
  }

  onDrawStart(event) {
    this._drawFeature = event.feature;
    this._drawListener = this._drawFeature.getGeometry().on('change', event => {
      let output;
      let position;
      let geometry = event.target;
      if (geometry.getType() === GeometryType.LINE_STRING) {
        output = formatLength(geometry);
        position = geometry.getLastCoordinate();
      } else {
        output = formatArea(geometry);
        position = geometry.getInteriorPoint().getCoordinates();
      }
      measureTooltip.innerHTML = output;
      measureTooltipOverlay.setPosition(position);
    });
  }

  onDrawEnd() {
    resetMeasureTooltip();
    // unset draw
    this._drawFeature = null;
    // unset tooltip so that a new one can be created
    this._map.addOverlay(getMeasureTooltipOverlay());
    unByKey(this._drawListener);
  }

  reset() {
    this._map.removeLayer(this._measureResultLayer);
    this._measureResultLayer.getSource().clear();
    this._measureResultLayer = null;
    resetTooltip();
    this._map.getOverlays().forEach(overlay => overlay.setPosition(undefined));
    this._map.getViewport().removeEventListener('mouseout', this.onMouseout);
    this._map.un('pointermove', this.onPointerMove.bind(this));
  }
}

function formatLength(line) {
  let output;
  let length = getLength(line);
  if (length > 1000) {
    output = `${Math.round((length / 1000) * 100) / 100} km`;
  } else {
    output = `${Math.round(length * 100) / 100} m`;
  }
  return output;
}

function formatArea(polygon) {
  let area = Math.round(getArea(polygon) * 100) / 100;
  return `${area} m<sup>2</sup>`;
}
