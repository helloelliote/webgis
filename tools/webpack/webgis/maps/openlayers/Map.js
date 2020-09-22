import Map from 'ol/Map';
import Vector from './layer/Vector';
import { view, syncZoomLevel } from './view';
import { default as addressOverlay } from './overlay/Address';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './interaction';
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
  overlays: [
    addressOverlay,
  ],
  controls: defaultControls,
  interactions: defaultInteractions,
  moveTolerance: 20,
});

map.addInteraction(new SelectInteraction({ map: map }));

map.on('contextmenu', onContextMenu);

function onContextMenu(event) {
  event.preventDefault();
  searchCoordinateToAddress(event.coordinate)
    .then(htmlContent => {
      addressOverlay.setContent(htmlContent);
      addressOverlay.setPosition(event.coordinate);
    });
}

map.on('moveend', onMoveEnd);

function onMoveEnd(event) {
  event.preventDefault();
  syncZoomLevel();
}
