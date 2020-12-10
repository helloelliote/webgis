/* eslint-disable no-undef */
import { LocalStorage } from '../../maps/Storage';
import { roundCustom } from '../../maps/math';

const localStorage = new LocalStorage();

const mapOptions = {
  center: new kakao.maps.LatLng(
    localStorage.latitude || window.webgis.center.latitude,
    localStorage.longitude || window.webgis.center.longitude,
  ),
  level: 3,
  draggable: true,
  disableDoubleClick: true,
  disableDoubleClickZoom: true,
  scrollwheel: true,
  tileAnimation: false,
};

const mapContainer = document.getElementById('search_map');

const map = new kakao.maps.Map(mapContainer, mapOptions);

const mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);

const dotSet = new Set();
const dotSrc = 'assets/media/symbols/EP002.png';
const dotSize = new kakao.maps.Size(12, 12);
const dotImage = new kakao.maps.MarkerImage(dotSrc, dotSize);

const markerSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
const markerSize = new kakao.maps.Size(24, 35);
const markerImage = new kakao.maps.MarkerImage(markerSrc, markerSize);

const marker = new kakao.maps.Marker({
  map: map,
  position: map.getCenter(),
  image: markerImage,
});
marker.setVisible(false);

const addressMarker = new kakao.maps.Marker({
  map: map,
});

kakao.maps.event.addListener(map, 'tilesloaded', onKakaoTilesLoaded);

const mapTypeButton = document.getElementById('btn-map-hybrid');
mapTypeButton.addEventListener('mousedown', onClickHybridButton);

window.addEventListener('resize', onWindowResize);

mapContainer.addEventListener('transitionend', onWindowResize);

document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline, false);

function onKakaoTilesLoaded() {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
}

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

function onWindowResize() {
  map.relayout();
}

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-address')) {
      const latLngArray = targetEl.nextElementSibling.innerHTML.split(',');
      const latLng = new kakao.maps.LatLng(latLngArray[1], latLngArray[0]);
      map.setCenter(latLng);
      addressMarker.setPosition(latLng);
      addressMarker.setTitle(targetEl.innerHTML);
      addressMarker.setMap(map);
    }
  }
}

function setMapMarker(pointArray) {
  const latLng = new kakao.maps.LatLng(pointArray[1], pointArray[0]);
  map.setCenter(latLng);
  marker.setPosition(latLng);
  marker.setVisible(true);
}

function setMapMarkerSet(coordinates) {
  dotSet.forEach(dot => dot.setMap(null));
  dotSet.clear();
  if (coordinates !== null) {
    let dotBounds = new kakao.maps.LatLngBounds();
    coordinates.forEach(coordinate => {
      let latLng = new kakao.maps.LatLng(coordinate[1], coordinate[0]);
      let dot = new kakao.maps.Marker({
        position: latLng,
        image: dotImage,
      });
      dot.setMap(map);
      dotSet.add(dot);
      dotBounds.extend(latLng);
    });
    map.setBounds(dotBounds);
  }
}

export {
  setMapMarker,
  setMapMarkerSet,
};
