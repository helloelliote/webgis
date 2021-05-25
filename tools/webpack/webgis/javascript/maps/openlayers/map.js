import Map from 'ol/Map';
import { Image, Vector } from './layer';
import { onMoveEnd, view } from './view';
import { addressOverlay } from './overlay';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './Interaction';
import { onClickQuickSearchInline, onClickTableCode, onContextMenu, onSingleClick, onWindowLoad } from './event';

const vectorLayer = new Vector();
vectorLayer.toggleLayers(window.webgis.table.vector);

const imageLayer = new Image();
imageLayer.toggleLayers(window.webgis.table.image);

const map = new Map({
  target: 'map-openlayers',
  view: view,
  layers: [
    imageLayer.layers,
    vectorLayer.layers,
  ],
  controls: defaultControls,
  interactions: defaultInteractions,
  moveTolerance: 20,
});

map.addOverlay(addressOverlay);

const selectInteraction = new SelectInteraction({ map: map });

map.addInteraction(selectInteraction);

map.on('contextmenu', onContextMenu);

map.on('moveend', onMoveEnd);

map.on('singleclick', onSingleClick);

// Fired when the DOM is ready which can be prior to images and other external content is loaded.
document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline.bind(view), false);

document.getElementById('btn-map-hybrid').addEventListener('mousedown', () => {
  window.webgis.isMapTypeIdRoadMap = !window.webgis.isMapTypeIdRoadMap;
  imageLayer.getLayer('geo_line_as').getSource().updateParams({
    ENV: window.webgis.isMapTypeIdRoadMap ? 'COLOR:#1118A8' : 'COLOR:#FFFF5A',
  });
});

// [...document.getElementById('ol-section-code-wtl').getElementsByClassName('dropdown-menu')].forEach(element => {
//   element.addEventListener('mousedown', onClickSectionCode.bind({ view: view, size: map.getSize() }), false);
// });

document.querySelectorAll('.ol-table-code-wtl').forEach(element => {
  element.addEventListener('mousedown', onClickTableCode.bind(vectorLayer), false);
});

document.querySelectorAll('.ol-table-code-swl').forEach(element => {
  element.addEventListener('mousedown', onClickTableCode.bind(vectorLayer), false);
});

document.querySelectorAll('.ol-table-code-geo').forEach(element => {
  element.addEventListener('mousedown', onClickTableCode.bind(imageLayer), false);
});

// Fired when the entire page loads, including its content (images, CSS, scripts, etc.)
window.addEventListener('load', onWindowLoad.bind(vectorLayer), false);

export {
  map,
  selectInteraction,
};
