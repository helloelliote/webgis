import Map from 'ol/Map';
import Vector from './layer/Vector';
import { syncZoomLevel, view } from './view';
import { default as addressOverlay } from './overlay/Address';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './interaction';
import {
  onClickQuickSearchResultAddress,
  onClickQuickSearchResultFacility,
  onClickTableCode,
  onClickTopbarLogo,
  onWindowLoad,
} from './event';
// import { searchCoordinateToAddress } from '../kakao/geoCoder';
import { searchCoordinateToAddress } from '../naver/geoCoder';

const vectorLayer = new Vector();
vectorLayer.toggleLayers([
  'viw_wtl_puri_as',
  'wtl_taper_ps',
  'wtl_cap_ps',
  'viw_wtl_pipe_lm',
  'viw_wtl_sply_ls',
  'viw_wtl_scvst_ps',
  'viw_wtl_meta_ps',
  'viw_wtl_flow_ps',
  'viw_wtl_fire_ps',
  'viw_wtl_valv_ps',
  'viw_wtl_serv_ps',
  'viw_wtl_pres_ps',
  'viw_wtt_wutl_ht_re',
  'wtl_userlabel_ps',
]);

const map = new Map({
  target: 'map-openlayers',
  view: view,
  layers: [
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

function onContextMenu(event) {
  event.preventDefault();
  searchCoordinateToAddress(event.coordinate)
    .then(htmlContent => {
      addressOverlay.popover('dispose');
      addressOverlay.setPosition(event.coordinate);
      addressOverlay.popover({
        container: addressOverlay.getElement(),
        html: true,
        content: htmlContent,
      });
      addressOverlay.popover('show');
    });
}

map.on('moveend', onMoveEnd);

function onMoveEnd(event) {
  event.preventDefault();
  syncZoomLevel();
}

// Fired when the DOM is ready which can be prior to images and other external content is loaded.
$(document).on('click', '.quick-search-result-facility', view, onClickQuickSearchResultFacility);
$(document).on('click', '.quick-search-result-address', view, onClickQuickSearchResultAddress);
$(document).on('click', '#topbar-logo', view, onClickTopbarLogo);
$(document).on('click', '.ol-table-code-wtl', { vectorLayer: vectorLayer }, onClickTableCode);
// Fired when the entire page loads, including its content (images, CSS, scripts, etc.)
$(window).on('load', { vectorLayer: vectorLayer }, onWindowLoad);

export {
  map,
  selectInteraction,
};
