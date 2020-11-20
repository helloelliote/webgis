window.webgis = {
  rect: '128.372325,36.686060,128.787714,37.073914',
  host: ((window.location.origin).toString()),
  geoserverHost: ((window.location.origin).toString()).replace(/3000/gi, '8000'),
};

require('../maps/openlayers/overlay/notification');
// window.OLWaterSection = undefined;
window.KTLayoutSearch = window.KTLayoutSearchInline = require('../maps/util/search');
