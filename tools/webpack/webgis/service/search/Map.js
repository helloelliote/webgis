import { LocalStorage } from '../../maps/Storage';
import { roundCustom } from '../../maps/math';

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
  if (coordinates === null) {
    marker.setMap(null);
    dotMap.setMap(null);
  } else {
    dotMap.setData(Array.from(coordinates));
    dotMap.setMap(tab1Map);
  }
}

let tab2Map;

function onTab1MapShown(coordinates) {
  dotMap.setMap(null);
  dotMap.setData(Array.from(coordinates));
  dotMap.setMap(tab1Map);
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

  dotMap.setMap(null);
  dotMap.setData(Array.from(coordinates));
  dotMap.setMap(tab2Map);
}

export {
  onClickSearch,
  setMapMarker,
  onTab1MapShown,
  onTab2MapShown,
};
