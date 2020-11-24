import Select from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import GeometryType from 'ol/geom/GeometryType';
import { createDefaultStyle } from 'ol/style/Style';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';
import MapError from '../Error';
import { FeatureOverlay } from './overlay';
import { createVectorStyle } from './layer';
import { layerNameFilter } from './filter';
import { selectLineStyle, selectPointStyle, selectPolygonFill } from './style';

export class SelectInteraction extends Select {

  constructor(options) {
    if (!options['map']) {
      throw new MapError('Map is undefined');
    }

    super({
      hitTolerance: 10,
      filter: function (feature, layer) {
        if (layer === null) return false;
        return !layerNameFilter.has(layer.getClassName());
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
            selectStyle.setFill(selectPolygonFill);
            return selectStyle;
          }
          default:
            return createDefaultStyle(feature, 0);
        }
      },
    });

    this._feature = new Feature();

    this._overaly = new FeatureOverlay({
      source: new VectorSource(),
      map: options['map'],
    });

    this.on('select', this.onSelectEvent);
  }

  onSelectEvent(event) {
    event.preventDefault();
    this._overaly.setOverlay(null);
    const feature = event.selected[0];
    if (!feature) return;
    switch (feature.getGeometry().getType()) {
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        this._feature.setStyle(selectPointStyle);
        this._feature.setGeometry(feature.getGeometry());
        this._overaly.setOverlay(this._feature);
        break;
      }
      default:
        break;
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