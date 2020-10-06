var map2Container = document.getElementById('map2');
var map2Option = {
  center: new kakao.maps.LatLng(36.828536, 128.625697),
  level: 3,
};

var map2 = new kakao.maps.Map(map2Container, map2Option);

new ResizeObserver(function () {
  map2Container.style.height = someHi.offsetHeight;
  map2.relayout();
}).observe(someHi);

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map2.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker();

var road = document.getElementById('input_road');

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map2, 'click', function (mouseEvent) {
  marker.setPosition(mouseEvent.latLng);
  marker.setMap(map2);
  searchDetailAddrFromCoords(mouseEvent.latLng, markerPosition);
});

function searchDetailAddrFromCoords(coords, callback) {
  // 좌표로 법정동 상세 주소 정보를 요청합니다
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function markerPosition(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    road.value = addrFormat(result);
  }
}

function addrFormat(result) {
  var road = result[0].road_address;
  var jibun = result[0].address;
  var address_no = jibun.sub_address_no ? jibun.main_address_no + '-' + jibun.sub_address_no : jibun.main_address_no;
  return road ? road.address_name + ` (${jibun.region_3depth_name} ${address_no})` : jibun.address_name;
}

window.addEventListener('keydown', function (event) {
  var key = event.key || event.keyCode;
  if (key === 'U+000A' || key === 'Enter' || key === 13) {
    if (event.target.nodeName === 'INPUT' && event.target.type === 'text') {
      event.preventDefault();
      return false;
    }
  }
}, true);
