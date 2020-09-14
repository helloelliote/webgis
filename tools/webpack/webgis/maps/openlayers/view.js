/* eslint-disable no-fallthrough */

import View from 'ol/View';
import { default as projection, coordsToLatLng } from './projection/Projection';
import { map as kakaoMap, mapContainer as kakaoMapContainer } from '../kakao/Map';
import { roundCustom } from '../math';
import { fromLonLat } from 'ol/proj';

let currentZoom;

const view = new View({
  projection: projection,
  center: fromLonLat([
    129.224803,
    35.856171,
  ], projection),
  zoom: 12.3,
  constrainResolution: false,
  constrainRotation: false,
  rotation: -0.02307,
});

view.on('change:center', function () {
  coordsToLatLng(view.getCenter())
    .then(latLng => {
      kakaoMap.setCenter(latLng);
    });
});

function syncZoomLevels() {
  let newZoom = Math.floor(view.getZoom()); // 12.3 -> 12
  if (newZoom !== currentZoom) {
    if (newZoom <= 14) {
      // noinspection FallThroughInSwitchStatementJS
      switch (newZoom) {
        case 5:
        // _toggleOverlay(null);
        case 14:
          if (kakaoMapContainer.style.display !== 'block') {
            kakaoMapContainer.style.display = 'block';
          }
        case 13:
        case 12:
        case 11:
        case 10:
        case 9:
        case 8:
        case 7:
        case 6:
          kakaoMap.setLevel(15 - newZoom);
          view.setZoom(newZoom + 0.3);
          break;
        default: {
          view.setZoom(5.3);
          newZoom = 5;
          // view.setCenter(config.map.home[_workspace]);
          break;
        }
      }
    } else {
      if (kakaoMapContainer.style.display !== 'none') {
        kakaoMapContainer.style.display = 'none';
      }
      if (newZoom > 18) {
        view.setZoom(18.3);
      }
    }
    currentZoom = newZoom;
  }
}

export {
  view,
  syncZoomLevels,
};
