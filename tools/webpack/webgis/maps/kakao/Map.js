import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';

const localStorage = new LocalStorage();

const mapContainer = document.getElementById('map');
const mapOptions = {
  center: new kakao.maps.LatLng(
    localStorage.latitude,
    localStorage.longitude,
  ),
  level: 3,
  draggable: false,
  disableDoubleClick: true,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  tileAnimation: false,
};

const map = new kakao.maps.Map(mapContainer, mapOptions);
map.setMinLevel(1);
map.setMaxLevel(9);

kakao.maps.event.addListener(map, 'tilesloaded', function () {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
});

window.addEventListener('resize', function () {
  map.relayout();
}, 
{ passive: true },
);

const viewSyncOptions = {
  zoom: {
    base: 12.3,
    max: 14,
    decimal: 0.3,
    coefficient: -1,
    delta: 15,
  },
  rotation: -0.02307,
};

kakao.maps.Map.prototype.setZoom = function (value) {
  map.setLevel(value);
};

export { map, mapContainer, viewSyncOptions };
