import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import { default as FeatureOverlay } from '../openlayers/overlay/Feature';
import { map as olMap, selectInteraction } from '../openlayers/Map';
import { default as projection, latLngToCoords } from '../openlayers/projection/Projection';
import { view as olView } from '../openlayers/view';
import { map } from './Map';
import { coordinateToLatLng } from './util';

let isActive = false;

const rvIcon = new FeatureOverlay({
  source: new VectorSource(),
  style: new Style({
    image: new Icon({
      anchor: [0.5, 1.0],
      src: `/assets/media/symbols/RV.png`, // TODO: Get a roadview icon
    }),
  }),
});
olMap.addLayer(rvIcon);

const rvLayer = new naver.maps.StreetLayer();
let rvPanorama;

const rvContainer = document.getElementById('map-container');
const rvButton = document.getElementById('btn-map-roadview');
rvButton.addEventListener('click', onClickRoadviewButton);

function onClickRoadviewButton(event) {
  event.preventDefault();

  isActive = !isActive;
  rvContainer.classList.toggle('grid-parent', isActive);
  rvButton.classList.toggle('active', isActive);
  window.dispatchEvent(new Event('resize'));

  if (isActive) {
    rvLayer.setMap(map);
    olMap.removeInteraction(selectInteraction);
    olMap.on('singleclick', onSingleClick);
    if (!rvPanorama) rvPanorama = new naver.maps.Panorama('map-roadview', {
      position: map.getCenter(),
    });
    naver.maps.Event.addListener(rvPanorama, 'pano_changed', onPanoramaChanged);
    rvPanorama.setVisible(true);
  } else {
    rvLayer.setMap(null);
    olMap.addInteraction(selectInteraction);
    olMap.un('singleclick', onSingleClick);
    rvPanorama.setVisible(false);
    rvIcon.clear();
  }
}

function onSingleClick(event) {
  event.preventDefault();
  coordinateToLatLng(event.coordinate, projection.code)
    .then(function (latLng) {
      rvPanorama.setPosition(latLng);
    });
}

function onPanoramaChanged() {
  const latLng = rvPanorama.getPosition();
  const coords = latLngToCoords(latLng.lat(), latLng.lng());
  olView.setCenter(coords);
  rvIcon.clear();
  rvIcon.addFeature(new Feature(new Point(coords)));
}
