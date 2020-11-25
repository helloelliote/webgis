/* eslint-disable no-undef */
import { LocalStorage } from '../../maps/Storage';
import { roundCustom } from '../../maps/math';
import { getAddressFromLatLng } from '../../maps/kakao/geoCoder';

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

const mapContainer = document.getElementById('map_register');

const map = new kakao.maps.Map(mapContainer, mapOptions);

const mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);
map.setMinLevel(1);
map.setMaxLevel(9);

const marker = new kakao.maps.Marker({
  map: map,
  position: map.getCenter(),
});
marker.setVisible(false);

kakao.maps.event.addListener(map, 'tilesloaded', onKakaoTileLoaded);

kakao.maps.event.addListener(map, 'click', onKakaoMapClick);

document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onClickQuickSearchInline, false);

window.addEventListener('resize', onWindowResize, { passive: true });

function onKakaoTileLoaded() {
  const center = map.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
}

function onKakaoMapClick(event) {
  onChangeLocation(event.latLng);
}

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-address')) {
      const latLngArray = targetEl.nextElementSibling.innerHTML.split(',');
      const latLng = new kakao.maps.LatLng(latLngArray[1], latLngArray[0]);
      map.setCenter(latLng);
      map.setLevel(1, { animate: true });
      onChangeLocation(latLng);
    }
  }
}

function onChangeLocation(latLng) {
  marker.setPosition(latLng);
  marker.setVisible(true);
  getAddressFromLatLng(latLng).then(function (response) {
    let address = response['address'];
    let road = response['road_address'];
    let jibun = address['address_name'];
    $('#service_register_form input[name="apm_adr_road"]')
      .val(road !== null ? road['address_name'] : ' ')
      .change();
    $('#service_register_form input[name="apm_adr_jibun"]')
      .val(jibun !== '' ? jibun : ' ')
      .change();

    $('#service_register_form input[name="apl_hjd"]')
      .val(null);

    $('#service_register_form input[name="apl_adr"]')
      .val(address['main_address_no'] + (address['sub_address_no'] === '' ? '' : '-' + address['sub_address_no']));

    $('#service_register_form input[name="x"]')
      .val(latLng.getLng());

    $('#service_register_form input[name="y"]')
      .val(latLng.getLat());
  });
}

function onWindowResize() {
  map.relayout();
}

new ResizeObserver(function () {
  document.getElementById('map_register').style.height = card_register.offsetHeight;
}).observe(card_register);
