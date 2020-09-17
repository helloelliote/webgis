import Select from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import GeometryType from 'ol/geom/GeometryType';
import { createDefaultStyle } from 'ol/style/Style';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';
import MapError from '../Error';
import FeatureOverlay from './overlay/Feature';
import { createVectorStyle } from './layer/Vector';
import { layerNameFilter } from './filter';
import { selectLineStyle } from './style/Line';
import { selectPointStyle } from './style/Point';
import { selectPolygonFill } from './style/Polygon';

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
            return createVectorStyle(feature).clone().setFill(selectPolygonFill);
          }
          default:
            return createDefaultStyle(feature, 0);
        }
      },
    });

    this.feature = new Feature();

    this.overaly = new FeatureOverlay({
      source: new VectorSource(),
      map: options['map'],
    });

    this.on('select', this.onSelectEvent);
  }

  onSelectEvent(event) {
    this.overaly.setOverlay(null);
    const feature = event.selected[0];
    if (!feature) return;
    switch (feature.getGeometry().getType()) {
      case GeometryType.POINT:
      case GeometryType.MULTI_POINT: {
        this.feature.setStyle(selectPointStyle);
        this.feature.setGeometry(feature.getGeometry());
        this.overaly.setOverlay(this.feature);
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
