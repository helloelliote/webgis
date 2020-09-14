import Select from 'ol/interaction/Select';
import { layerNameFilter } from './filter';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';

const select = new Select({
  hitTolerance: 10,
  filter: function (feature, layer) {
    if(layer === null) return false;
    return !layerNameFilter.has(layer.getClassName());
  },
  // style: function (feature) {
  //   return ''; // TODO: style function;
  // },
});

select.on('select', function (event) {

});

export default defaultInteractions({
  altShiftDragRotate: false,
  doubleClickZoom: false,
  shiftDragZoom: false,
  pinchRotate: false,
  dragPan: true,
  zoomDelta: 1,
  zoomDuration: 0,
}).extend([
  select,
  new MouseWheelZoom({
    constrainResolution: true,
    maxDelta: 1,
    duration: 0,
    // useAnchor: true 고정, Enable zooming using the mouse's location as the anchor
    useAnchor: true,
  }),
]);
