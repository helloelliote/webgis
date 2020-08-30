import GeoJSON from 'ol/format/GeoJSON';
import { default as projection } from './projection/index';

const geoJson = new GeoJSON({
  dataProjection: projection,
  featureProjection: projection,
});

export default geoJson;
