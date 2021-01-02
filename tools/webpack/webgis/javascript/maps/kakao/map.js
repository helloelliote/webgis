import { getDefaultCenter, onClickMapTypeButton, onTilesLoaded, onWindowResize } from './util';

const mapOptions = {
  center: getDefaultCenter(),
  level: 3,
  draggable: false,
  disableDoubleClick: true,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  tileAnimation: false,
};

const mapContainer = document.getElementById('map');

const map = new kakao.maps.Map(mapContainer, mapOptions);
map.setMinLevel(1);
map.setMaxLevel(9);

kakao.maps.event.addListener(map, 'tilesloaded', onTilesLoaded.bind(map));

const mapTypeButton = document.getElementById('btn-map-hybrid');
mapTypeButton.addEventListener('mousedown', onClickMapTypeButton.bind({ map, mapContainer }));

window.addEventListener('resize', onWindowResize.bind(map), { passive: true });

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
