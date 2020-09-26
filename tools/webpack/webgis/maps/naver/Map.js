import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';

const localStorage = new LocalStorage();

const mapOptions = {
  center: new naver.maps.LatLng(
    localStorage.latitude,
    localStorage.longitude,
  ),
  zoom: 17,
  minZoom: 11,
  maxZoom: 21,
  // Controls
  scaleControlOptions: {
    position: naver.maps.Position.BOTTOM_LEFT,
  },
  // Interactions
  draggable: false,
  pinchZoom: false,
  scrollWheel: false,
  disableDoubleClickZoom: true,
  disableDoubleTapZoom: true,
  disableTwoFingerTapZoom: true,
  // Others
  tileTransition: false,
  // StyleMap
  useStyleMap: true,
  mapTypes: new naver.maps.MapTypeRegistry({
    'normal': naver.maps.NaverStyleMapTypeOption.getNormalMap({
      overlayType: 'bg.ol.sw.ar.lko',
    }),
    'hybrid': naver.maps.NaverStyleMapTypeOption.getHybridMap({
      overlayType: 'bg.ol.sw.ar.lko',
    }),
  }),
};

const map = new naver.maps.Map('map', mapOptions);

// map.setMapTypeId(naver.maps.MapTypeId['HYBRID']);

naver.maps.Event.addListener(map, 'tilesloaded', function () {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.lat());
  localStorage.longitude = roundCustom(center.lng());
});

window.addEventListener('resize', function () {
  map.refresh();
},
{ passive: true },
);

const viewSyncOptions = {
  zoom: {
    base: 12.34,
    max: 16,
    decimal: 0.34,
    coefficient: 1,
    delta: 5,
  },
  rotation: 0,
};

export {
  map,
  viewSyncOptions,
};
