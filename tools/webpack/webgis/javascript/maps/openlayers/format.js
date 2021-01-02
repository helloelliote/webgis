import { GeoJSON, WFS } from 'ol/format';
import { default as projection } from './projection';

const geoJson = new GeoJSON({
  dataProjection: projection,
  featureProjection: projection,
});

const wfs = new WFS({
  version: '2.0.0',
});

export {
  geoJson,
  wfs,
};
