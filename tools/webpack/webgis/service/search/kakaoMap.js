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

const mapContainer = document.getElementById('card_search_map');
const distContainer = document.getElementById('card_dist_map');

const tab1Map = new kakao.maps.Map(mapContainer, mapOptions);

const mapTypeControl = new kakao.maps.MapTypeControl();
tab1Map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);

const marker = new kakao.maps.Marker({
  map: tab1Map,
  position: tab1Map.getCenter(),
});
marker.setVisible(false);

const dotSet = new Set();
const dotSrc = 'assets/media/symbols/EP002.png';
const dotSize = new kakao.maps.Size(12, 12);
const dotImage = new kakao.maps.MarkerImage(dotSrc, dotSize);

const infoWindow = new kakao.maps.InfoWindow({
  removable: true,
});

kakao.maps.event.addListener(tab1Map, 'tilesloaded', onKakaoTilesLoaded);

document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline, false);

window.addEventListener('resize', onWindowResize, { passive: true });

function onKakaoTilesLoaded() {
  const center = tab1Map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
}

function onWindowResize() {
  tab1Map.relayout();
}

function setMapMarker(pointArray) {
  const latLng = new kakao.maps.LatLng(pointArray[1], pointArray[0]);
  tab1Map.setCenter(latLng);
  marker.setPosition(latLng);
  marker.setVisible(true);
}

function onClickSearch(coordinates) {
  addMarkers(tab1Map, coordinates);
}

let tab2Map;

function onTab1MapShown(coordinates) {
  addMarkers(tab1Map, coordinates);
}

function onTab2MapShown(coordinates) {
  if (!tab2Map) {
    tab2Map = new kakao.maps.Map(distContainer, mapOptions);
  } else {
    tab2Map.setCenter(new kakao.maps.LatLng(
      localStorage.latitude,
      localStorage.longitude,
    ));
  }
  addMarkers(tab2Map, coordinates);
}

function addMarkers(map, coordinates) {
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

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-address')) {
      const latLngArray = targetEl.nextElementSibling.innerHTML.split(',');
      const latLng = new kakao.maps.LatLng(latLngArray[1], latLngArray[0]);
      tab1Map.setCenter(latLng);
      tab1Map.setLevel(2, { animate: true });
      infoWindow.setPosition(latLng);
      infoWindow.setContent(targetEl.innerHTML);
      infoWindow.open(tab1Map);
    }
  }
}

export {
  onClickSearch,
  setMapMarker,
  onTab1MapShown,
  onTab2MapShown,
};
