import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { LocalStorage } from '../Storage';
import { default as projection } from './projection';
// import { map, viewSyncOptions } from '../naver/Map';
// import { coordinateToLatLng } from '../naver/util';
import { map, mapContainer, viewSyncOptions } from '../kakao/Map';
import { coordinateToLatLng } from '../kakao/util';

const localStorage = new LocalStorage();

const zoomOpt = viewSyncOptions.zoom;
const base = zoomOpt.base;
const max = zoomOpt.max;
const coefficient = zoomOpt.coefficient;
const delta = zoomOpt.delta;
const decimal = zoomOpt.decimal;
let currentZoom;

const view = new View({
  projection: projection,
  center: fromLonLat([
    localStorage.longitude || window.webgis.center.longitude,
    localStorage.latitude || window.webgis.center.latitude,
  ], projection),
  zoom: base,
  constrainResolution: false,
  constrainRotation: false,
  rotation: viewSyncOptions.rotation,
});

view.on('change:center', onChangeCenter);

function onChangeCenter() {
  coordinateToLatLng(view.getCenter(), projection.code)
    .then(function (latLng) {
      map.setCenter(latLng);
    });
}

function onMoveEnd(event) {
  event.preventDefault();
  let newZoom = ~~view.getZoom();
  if (newZoom !== currentZoom) {
    if (newZoom <= max) {
      // noinspection FallThroughInSwitchStatementJS
      switch (newZoom) {
        // case 5:
        //   _toggleOverlay(null);
        case 14:
          if (mapContainer.style.display !== 'block') {
            mapContainer.style.display = 'block';
          }
        case 13:
        case 12:
        case 11:
        case 10:
        case 9:
        case 8:
        case 7:
        case 6: {
          view.setZoom(newZoom + decimal);
          map.setZoom(coefficient * newZoom + delta);
          break;
        }
        default: {
          view.setZoom(5 + decimal);
          newZoom = 5;
          view.setCenter(fromLonLat([
            window.webgis.center.longitude,
            window.webgis.center.latitude,
          ], projection));
          break;
        }
      }
    } else {
      if (mapContainer.style.display !== 'none') {
        mapContainer.style.display = 'none';
      }
      if (newZoom > 20) {
        view.setZoom(20 + decimal);
      }
    }
    currentZoom = newZoom;
  }
}

export {
  onMoveEnd,
  view,
};
