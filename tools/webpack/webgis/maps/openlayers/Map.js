import Map from 'ol/Map';
import { view, syncZoomLevels } from './view';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './interaction';

import Vector from './layer/Vector';
import { showAddressPopover } from '../kakao/geoCoder';

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

map.addInteraction(new SelectInteraction({ map: map }));

map.on('contextmenu', showAddressPopover);

map.on('moveend', syncZoomLevels);
