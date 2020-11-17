window.webgis = {
  // workspace: customSessionStorage.get('workspace'),
  workspace: 'yeongju_a',
  role: '상수',
  center: {
    latitude: 36.805679,
    longitude: 128.624043,
  },
  rect: '128.372325,36.686060,128.787714,37.073914',
  host: ((window.location.origin).toString()),
  geoserverHost: ((window.location.origin).toString()).replace(/3000/gi, '8000'),
};

require('./kakao/Map');
// require('./naver/Map');
require('./openlayers/overlay/notification');
require('./openlayers/Map');
// require('./naver/roadview');
require('./kakao/roadview');
window.OLWaterSection = require('./util/section');
window.KTLayoutSearch = window.KTLayoutSearchInline = require('./util/search');
