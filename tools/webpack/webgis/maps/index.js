window.webgis = {
  // workspace: customSessionStorage.get('workspace'),
  workspace: 'gyeongju_a',
  center: {
    latitude: 35.856171,
    longitude: 129.224803,
  },
  rect: '128.908021,35.631390,129.582420,36.087606',
  host: ((window.location.origin).toString()),
  geoserverHost: ((window.location.origin).toString()).replace(/3000/gi, '8000'),
};

// require('./kakao/Map');
require('./naver/Map');
require('./openlayers/overlay/notification');
require('./openlayers/Map');
require('./naver/roadview');
