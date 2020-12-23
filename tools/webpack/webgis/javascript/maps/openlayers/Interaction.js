import Select from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import GeometryType from 'ol/geom/GeometryType';
import { singleClick } from 'ol/events/condition';
import { createDefaultStyle } from 'ol/style/Style';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';
import MapError from '../Error';
import { FeatureOverlay } from './overlay';
import { InfoModal } from './modal';
import { createVectorStyle } from './layer';
import { selectLineStyle, selectPointStyle, selectPolygonStyle } from './style';

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

    this._modal = new InfoModal('kt_chat_modal');
    this._modal.addInteraction(this);

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
        this._modal.setFeatureAsync(feature).then(modal => {
          modal.showModal();
        });
        break;
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        this._overlayFeature.setStyle(selectPointStyle);
        this._overlayFeature.setGeometry(feature.getGeometry());
        this._overlay.setOverlay(this._overlayFeature);
        this._modal.setFeatureAsync(feature).then(modal => {
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
