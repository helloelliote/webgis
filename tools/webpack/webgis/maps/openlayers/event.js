import { getCenter } from 'ol/extent';
import { default as geoJson } from './format';

const _mapContainer = document.getElementById('map-container');
const _centerX = Math.round(_mapContainer.clientWidth / 2);
const _centerY = Math.round(_mapContainer.clientHeight / 2);

function onClickQuickSearchResult(event) {
  // TODO: (Maybe) highlight selected item
  // Move view (assigned to event.data) center on selected item
  const coordinate = $(event.target).next('p').html();
  const feature = geoJson.readFeature(coordinate);
  const extent = getCenter(feature.getGeometry().getExtent());
  (event.data).centerOn(extent, [100, 100], [_centerX, _centerY]);
}

export {
  onClickQuickSearchResult,
};
