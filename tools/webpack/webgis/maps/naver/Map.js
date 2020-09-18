import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';
import { toLonLat } from 'ol/proj';

const localStorage = new LocalStorage();

const mapContainer = document.getElementById('map');
const mapOptions = {
  center: new naver.maps.LatLng(
    35.856171,
    129.224803,
  ),
  zoom: 17,
  minZoom: 10,
  maxZoom: 21,
  // Controls
  scaleControl: true,
  scaleControlOptions: {
    position: naver.maps.Position.BOTTOM_LEFT,
  },
  logoControl: false,
  zoomControl: false, // TODO: https://navermaps.github.io/maps.js.ncp/docs/naver.maps.ZoomControl.html
  mapTypeControl: false,
  mapDataControl: false,
  // Interactions
  draggable: false,
  pinchZoom: false,
  scrollWheel: false,
  keyboardShortcuts: false,
  disableDoubleClickZoom: true,
  disableDoubleTapZoom: true,
  disableTwoFingerTapZoom: true,
  // Others
  tileTransition: false,
  disableKineticPan: true,
  // StyleMap
  useStyleMap: true,
  mapTypes: new naver.maps.MapTypeRegistry({
    'normal': naver.maps.NaverStyleMapTypeOption.getNormalMap({
      overlayType: 'bg.ol.lko', // bg.ol.sw.ar.lko
    }),
    'hybrid': naver.maps.NaverStyleMapTypeOption.getHybridMap({
      overlayType: 'bg.ol.lko',
    }),
  }),
};

const map = new naver.maps.Map(mapContainer, mapOptions);

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
    decimal: 0.34,
    coefficient: 1,
    delta: 5,
  },
  rotation: 0,
};

function coordsToLatLng(coordinate, projection = 'EPSG:5187') {
  return new Promise(resolve => {
    const lonLat = toLonLat(coordinate, projection);
    const latLng = new naver.maps.LatLng(lonLat[1], lonLat[0]);
    resolve(latLng);
  });
}

export { map, mapContainer, viewSyncOptions, coordsToLatLng };
