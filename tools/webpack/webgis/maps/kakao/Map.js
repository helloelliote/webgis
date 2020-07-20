import { LocalStorage } from '../Storage';

const localStorage = new LocalStorage();

const kakaoContainer = document.getElementById('map-kakao');

const kakaoOption = {
  center: new kakao.maps.LatLng(
    // 경주
    localStorage.latitude || 35.856171,
    localStorage.longitude || 129.224803,
  ),
  level: 3,
  draggable: false,
  disableDoubleClick: true,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  tileAnimation: false,
};
export const kakaoMap = new kakao.maps.Map(kakaoContainer, kakaoOption);
kakaoMap.setMinLevel(1);
kakaoMap.setMaxLevel(9);

/**
 * Object 로는 저장할 수 없기에 json 변환해 저장, 불러오기한다.
 * let loc = {lat: center.getLat(), lng: center.getLng()};
 * storage['loc'] = JSON.stringify(loc);
 * const lat = (JSON.parse(storage['loc']))['lat'];
 */
kakao.maps.event.addListener(kakaoMap, 'tilesloaded', function() {
  const center = kakaoMap.getCenter();
  console.log(center);
});
