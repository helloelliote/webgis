import { getCenter } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import { default as geoJson } from './format';
import { default as projection } from './projection/Projection';

const _mapContainer = document.getElementById('map-container');
const _centerX = Math.round(_mapContainer.clientWidth / 2);
const _centerY = Math.round(_mapContainer.clientHeight / 2);

function onClickQuickSearchResultFacility(event) {
  // TODO: (Maybe) highlight selected item
  // Move view (assigned to event.data) center on selected item
  const coordinate = $(event.target).next('p').html();
  const feature = geoJson.readFeature(coordinate);
  const extent = getCenter(feature.getGeometry().getExtent());
  (event.data).centerOn(extent, [100, 100], [_centerX, _centerY]);
}

function onClickQuickSearchResultAddress(event) {
  // Move view (assigned to event.data) center on selected item
  const coordinate = $(event.target).next('p').html().split(',');
  const [lng, lat] = [coordinate[0], coordinate[1]];
  const center = fromLonLat([lng, lat], projection);
  (event.data).setCenter(center);
}

export {
  onClickQuickSearchResultFacility, onClickQuickSearchResultAddress,
};
