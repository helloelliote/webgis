import { LocalStorage } from '../../maps/Storage';
import { roundCustom } from '../../maps/math';

const localStorage = new LocalStorage();

const mapOptions = {
  center: new naver.maps.LatLng(
    localStorage.latitude || window.webgis.center.latitude,
    localStorage.longitude || window.webgis.center.longitude,
  ),
  zoom: 17,
  minZoom: 11,
  maxZoom: 21,
  // Controls
  mapDataControl: false,
  zoomControl: false,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: naver.maps.MapTypeControlStyle.BUTTON,
    position: naver.maps.Position.TOP_LEFT,
  },
  // Interactions
  draggable: true,
  pinchZoom: true,
  scrollWheel: true,
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

const tab1Map = new naver.maps.Map('card_search_map', mapOptions);

const marker = new naver.maps.Marker({
  map: tab1Map,
  position: tab1Map.getCenter(),
  clickable: false,
  visible: false,
});

/**
 * 점지도 시각화하기
 *
 * @link https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.DotMap.html
 */
const dotMap = new naver.maps.visualization.DotMap({
  map: tab1Map,
  data: [],
  opacity: 1,
  radius: 6,
});

naver.maps.Event.addListener(tab1Map, 'tilesloaded', onNaverTilesLoaded);

document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline, false);

window.addEventListener('resize', onWindowResize, { passive: true });

function onNaverTilesLoaded() {
  const center = tab1Map.getCenter();
  localStorage.latitude = roundCustom(center.lat());
  localStorage.longitude = roundCustom(center.lng());
}

function onWindowResize() {
  tab1Map.refresh();
}

function setMapMarker(pointArray) {
  tab1Map.setCenter(pointArray);
  marker.setPosition(pointArray);
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
    tab2Map = new naver.maps.Map('card_dist_map', mapOptions);
  } else {
    tab2Map.setCenter(new naver.maps.LatLng(
      localStorage.latitude,
      localStorage.longitude,
    ));
  }
  addMarkers(tab2Map, coordinates);
}

function addMarkers(map, coordinates) {
  dotMap.setMap(null);
  dotMap.setData(Array.from(coordinates));
  dotMap.setMap(map);
}

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-address')) {
      const latLngArray = targetEl.nextElementSibling.innerHTML.split(',');
      const latLng = new naver.maps.LatLng(latLngArray[1], latLngArray[0]);
      tab1Map.setCenter(latLng);
      tab1Map.setZoom(19);
    }
  }
}

export {
  onClickSearch,
  setMapMarker,
  onTab1MapShown,
  onTab2MapShown,
};
