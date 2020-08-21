'use strict';

import { customSessionStorage } from './Storage';

window.webgis = {
  workspace: customSessionStorage.get('workspace'),
  geoserverHost: ((window.location.origin).toString()).replace(/3000/gi, '8000'),
};

require('./openlayers/openlayers.css');
require('./kakao/kakao.css');

require('./openlayers/Map');
