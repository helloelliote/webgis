import { customSessionStorage } from './Storage';

window.webgis = {
  // workspace: customSessionStorage.get('workspace'),
  workspace: 'gyeongju_a',
  host: ((window.location.origin).toString()),
  geoserverHost: ((window.location.origin).toString()).replace(/3000/gi, '8000'),
};

require('./kakao/kakao.css');
require('./openlayers/openlayers.css');

require('./kakao/Map');
require('./openlayers/Map');
