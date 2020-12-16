import Map from 'ol/Map';
import { Tile, Vector } from './layer';
import { onMoveEnd, view } from './view';
import { addressOverlay } from './overlay';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './interaction';
import { onClickQuickSearchInline, onClickTableCode, onContextMenu, onSingleClick, onWindowLoad } from './event';

const vectorLayer = new Vector();
vectorLayer.toggleLayers([
  'viw_wtl_puri_as',
  // 'viw_wtl_taper_ps',
  'viw_wtl_cap_ps',
  'viw_wtl_pipe_lm',
  'viw_wtl_sply_ls',
  // 'viw_wtl_scvst_ps',
  'viw_wtl_meta_ps',
  'viw_wtl_flow_ps',
  'viw_wtl_fire_ps',
  'viw_wtl_valv_ps',
  'viw_wtl_serv_ps',
  'viw_wtl_pres_ps',
  'viw_wtt_wutl_ht',
  'viw_wtl_userlabel_ps',
]);

const tileLayer = new Tile();
tileLayer.toggleLayers([
  'n3a_a0010000',
  'n3a_b0010000',
]);

const map = new Map({
  target: 'map-openlayers',
  view: view,
  layers: [
    tileLayer.layers,
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

// Fired when the DOM is ready which can be prior to images and other external content is loaded.\
document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline.bind(view), false);

// [...document.getElementById('ol-section-code-wtl').getElementsByClassName('dropdown-menu')].forEach(element => {
//   element.addEventListener('click', onClickSectionCode.bind({ view: view, size: map.getSize() }), false);
// });

[...document.getElementsByClassName('ol-table-code-wtl')].forEach(element => {
  element.addEventListener('click', onClickTableCode.bind(vectorLayer), false);
});

// Fired when the entire page loads, including its content (images, CSS, scripts, etc.)
window.addEventListener('load', onWindowLoad.bind(vectorLayer), false);

export {
  map,
  selectInteraction,
};
