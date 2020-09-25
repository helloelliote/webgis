import Map from 'ol/Map';
import Vector from './layer/Vector';
import { syncZoomLevel, view } from './view';
import { default as addressOverlay } from './overlay/Address';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './interaction';
import { onClickQuickSearchResultAddress, onClickQuickSearchResultFacility } from './event';
// import { searchCoordinateToAddress } from '../kakao/geoCoder';
import { searchCoordinateToAddress } from '../naver/geoCoder';

const vectorLayer = new Vector();
vectorLayer.toggleLayers([
  'viw_wtl_pipe_lm',
  'viw_wtl_fire_ps',
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

map.addInteraction(new SelectInteraction({ map: map }));

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

$(document).on('click', '.quick-search-result-facility', view, onClickQuickSearchResultFacility);
$(document).on('click', '.quick-search-result-address', view, onClickQuickSearchResultAddress);
