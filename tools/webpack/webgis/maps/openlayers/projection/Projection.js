/* eslint-disable no-undef */
import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { fromLonLat } from 'ol/proj';
import { roundCustom } from '../../math';

/**
 * @see https://epsg.io/{four_digit_code} for more EPSG projection definitions
 */
class ProjectionFactory extends Projection {

  constructor(opt_code) {
    const _defaultProjectionCode = opt_code ? opt_code :'EPSG:5187';
    const _defaultProjectionDefinition = [
      'EPSG:5187',
      '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ];
    const _projectionExtent = [-415909.65, -426336.34, 649203.95, 865410.62];

    proj4.defs([_defaultProjectionDefinition]);
    register(proj4);

    super({
      code: _defaultProjectionCode,
      extent: _projectionExtent,
    });
  }

  get code() {
    return super.getCode();
  }
}

const projection = new ProjectionFactory();

function latLngToCoords(lat, lng) {
  return fromLonLat([roundCustom(lng), roundCustom(lat)], projection.code);
}

export { latLngToCoords };

export default projection;
