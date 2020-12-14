/* eslint-disable no-undef */
import { toLonLat } from 'ol/proj';
import { roundCustom } from '../math';
import { LocalStorage } from '../Storage';

const localStorage = new LocalStorage();

function getDefaultCenter() {
  return new kakao.maps.LatLng(
    localStorage.latitude || window.webgis.center.latitude,
    localStorage.longitude || window.webgis.center.longitude,
  );
}

/**
 * @requires Set .bind(map) when calling this function
 */
function onTilesLoaded() {
  const center = this.getCenter();
  localStorage.latitude = roundCustom(center.getLat());
  localStorage.longitude = roundCustom(center.getLng());
}

/**
 * @requires Set .bind({ map, mapContainer }) when calling this function
 */
function onClickMapTypeButton(event) {
  event.preventDefault();

  const map = this['map'];
  const mapContainer = this['mapContainer'];

  switch (map.getMapTypeId()) {
    case kakao.maps.MapTypeId.ROADMAP: {
      if (mapContainer.style.display === 'none') {
        $.notify({
          message: '항공 지도를 보시려면 지도를 축소해주세요',
        }, { type: 'danger' });
      }
      event.target.innerHTML = '위성 지도';
      event.target.classList.add('active');
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      break;
    }
    case kakao.maps.MapTypeId.HYBRID: {
      event.target.innerHTML = '일반 지도';
      event.target.classList.remove('active');
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      break;
    }
  }
}

/**
 * @requires Set .bind(map) when calling this function
 */
function onWindowResize() {
  this.relayout();
}

function coordinateToLatLng(coordinate, projection = 'EPSG:5187') {
  return new Promise(resolve => {
    const lonLat = toLonLat(coordinate, projection);
    const latLng = new kakao.maps.LatLng(lonLat[1], lonLat[0]);
    resolve(latLng);
  });
}

export {
  getDefaultCenter,
  onTilesLoaded,
  onClickMapTypeButton,
  onWindowResize,
  coordinateToLatLng,
};
