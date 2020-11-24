import { LocalStorage } from '../Storage';
import { roundCustom } from '../math';

const localStorage = new LocalStorage();

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

const mapContainer = document.getElementById('map');

const map = new kakao.maps.Map(mapContainer, mapOptions);
map.setMinLevel(1);
map.setMaxLevel(9);

kakao.maps.event.addListener(map, 'tilesloaded', function () {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
});

const mapTypeButton = document.getElementById('btn-map-hybrid');
mapTypeButton.addEventListener('mousedown', onClickHybridButton);

function onClickHybridButton(event) {
  event.preventDefault();

  switch (map.getMapTypeId()) {
    case kakao.maps.MapTypeId.ROADMAP: {
      if (mapContainer.style.display === 'none') {
        $.notify({
          message: '항공 지도를 보시려면 지도를 축소해주세요',
        }, { type: 'danger' });
      }
      mapTypeButton.innerHTML = '위성 지도';
      mapTypeButton.classList.add('active');
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      break;
    }
    case kakao.maps.MapTypeId.HYBRID: {
      mapTypeButton.innerHTML = '일반 지도';
      mapTypeButton.classList.remove('active');
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      break;
    }
  }
}

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
