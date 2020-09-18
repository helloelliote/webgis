import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';
import { toLonLat } from 'ol/proj';

const localStorage = new LocalStorage();

const mapContainer = document.getElementById('map');
const mapOptions = {
  center: new kakao.maps.LatLng(
    35.856171,
    129.224803,
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

kakao.maps.Map.prototype.setZoom = function (value) {
  map.setLevel(value);
};

const viewSyncOptions = {
  zoom: {
    base: 12.3,
    decimal: 0.3,
    coefficient: -1,
    delta: 15,
  },
  rotation: -0.02307,
};

function coordsToLatLng(coordinate, projection = 'EPSG:5187') {
  return new Promise(resolve => {
    const lonLat = toLonLat(coordinate, projection);
    const latLng = new kakao.maps.LatLng(lonLat[1], lonLat[0]);
    resolve(latLng);
  });
}

export { map, mapContainer, viewSyncOptions, coordsToLatLng };
