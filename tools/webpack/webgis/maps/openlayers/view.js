import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { LocalStorage } from '../Storage';
import { default as projection } from './projection/Projection';
import { default as geoJson } from './format';
import { map, mapContainer, viewSyncOptions } from '../naver/Map';
import { coordinateToLatLng } from '../naver/util';
// import { map, mapContainer, viewSyncOptions } from '../kakao/Map';
// import { coordinateToLatLng } from '../kakao/util';

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
    localStorage.longitude,
    localStorage.latitude,
  ], projection),
  zoom: base,
  maxZoom: 18,
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

$(document).on('click', '.quick-search-result-item', onClickQuickSearchResultItem);

function onClickQuickSearchResultItem() {
  if (view.getZoom() < 10) {
    view.setZoom(9 + decimal);
  }
  const feature = geoJson.readFeature($(this).next('p').html());
  view.adjustCenter([0.00001, 0.00001]);
  view.fit(feature.getGeometry());
}

function syncZoomLevel() {
  let newZoom = Math.floor(view.getZoom());
  if (newZoom !== currentZoom) {
    if (5 < newZoom && newZoom <= max) {
      view.setZoom(newZoom + decimal);
      map.setZoom(coefficient * newZoom + delta);
    } else if (newZoom > max) {
      view.setZoom(max + decimal);
      newZoom = max;
    } else {
      view.setZoom(6 + decimal);
      view.setCenter(fromLonLat([
        129.224803,
        35.856171,
      ], projection));
      newZoom = 5;
    }
    currentZoom = newZoom;
  }
}

export {
  view,
  syncZoomLevel,
};
