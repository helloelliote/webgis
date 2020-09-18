/* eslint-disable no-fallthrough */

import View from 'ol/View';
import { default as projection } from './projection/Projection';
// import { map, mapContainer, viewSyncOptions as viewOpt, coordsToLatLng } from '../kakao/Map';
import { map, mapContainer, viewSyncOptions as viewOpt, coordsToLatLng } from '../naver/Map';
import { roundCustom } from '../math';
import { fromLonLat } from 'ol/proj';

let zoom, zoomOpt = viewOpt['zoom'];

const view = new View({
  projection: projection,
  center: fromLonLat([
    129.224803,
    35.856171,
  ], projection),
  zoom: zoomOpt['base'],
  constrainResolution: false,
  constrainRotation: false,
  rotation: viewOpt['rotation'],
});

view.on('change:center', function () {
  coordsToLatLng(view.getCenter(), projection.code)
    .then(latLng => {
      map.setCenter(latLng);
    });
});

function syncZoomLevels() {
  let newZoom = Math.floor(view.getZoom());
  if (newZoom !== zoom) {
    if (newZoom <= 16) {
      // noinspection FallThroughInSwitchStatementJS
      switch (newZoom) {
        case 5:
        // _toggleOverlay(null);
        case 16:
          if (mapContainer.style.display !== 'block') {
            mapContainer.style.display = 'block';
          }
        case 15:
        case 14:
        case 13:
        case 12:
        case 11:
        case 10:
        case 9:
        case 8:
        case 7:
        case 6: {
          map.setZoom(newZoom * (zoomOpt['coefficient']) + zoomOpt['delta']);
          view.setZoom(newZoom + zoomOpt['decimal']);
          break;
        }
        default: {
          view.setZoom(5 + zoomOpt['decimal']);
          newZoom = 5;
          break;
        }
      }
    } else {
      if (mapContainer.style.display !== 'none') {
        mapContainer.style.display = 'none';
      }
      if (newZoom > 18) {
        view.setZoom(18 + zoomOpt['delta']);
      }
    }
    zoom = newZoom;
  }
}

export {
  view,
  syncZoomLevels,
};
