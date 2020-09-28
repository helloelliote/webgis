import { getCenter } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import { default as geoJson } from './format';
import { default as projection } from './projection/Projection';

const mapContainer = document.getElementById('map-container');
const centerX = Math.round(mapContainer.clientWidth / 2);
const centerY = Math.round(mapContainer.clientHeight / 2);

function onClickQuickSearchResultFacility(event) {
  event.preventDefault();
  // TODO: (Maybe) highlight selected item
  // Move view (assigned to event.data) center on selected item
  const coordinate = $(event.target).next('p').html();
  const feature = geoJson.readFeature(coordinate);
  const extent = getCenter(feature.getGeometry().getExtent());
  (event.data).centerOn(extent, [100, 100], [centerX, centerY]);
}

function onClickQuickSearchResultAddress(event) {
  event.preventDefault();
  // TODO: (Maybe) Add an icon feature on selected location
  // Move view (assigned to event.data) center on selected item
  const lagLng = $(event.target).next('p').html().split(',');
  const [lng, lat] = [lagLng[0], lagLng[1]];
  const coords = fromLonLat([lng, lat], projection);
  (event.data).setCenter(coords);
}

function onClickTopbarLogo(event) {
  event.preventDefault();
  // Move view (assigned to event.data) center on predefined, default location
  const [lng, lat] = [window.webgis.center.longitude, window.webgis.center.latitude];
  const center = fromLonLat([lng, lat], projection);
  (event.data).setCenter(center);
}

export {
  onClickQuickSearchResultFacility, onClickQuickSearchResultAddress, onClickTopbarLogo,
};
