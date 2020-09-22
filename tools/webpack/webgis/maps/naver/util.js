import { toLonLat } from 'ol/proj';

function coordinateToLatLng(coordinate, projection = 'EPSG:5187') {
  return new Promise(resolve => {
    const lonLat = toLonLat(coordinate, projection);
    const latLng = new naver.maps.LatLng(lonLat[1], lonLat[0]);
    resolve(latLng);
  });
}

export {
  coordinateToLatLng,
};
