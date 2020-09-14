import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';

const localStorage = new LocalStorage();

const mapContainer = document.getElementById('map-kakao');
const mapOption = {
  center: new kakao.maps.LatLng(
    localStorage.latitude || 36.828536,
    localStorage.longitude || 128.625697,
  ),
  level: 3,
  draggable: false,
  disableDoubleClick: true,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  tileAnimation: false,
};

const map = new kakao.maps.Map(mapContainer, mapOption);
map.setMinLevel(1);
map.setMaxLevel(9);

kakao.maps.event.addListener(map, 'tilesloaded', function () {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
});

export { map };
