import { MeasureInteraction } from './Interaction';
import { map, selectInteraction } from './map';

let isLength = false, isArea = false;
let measureType, measureInteraction;

const measureLengthButton = document.getElementById('btn-map-length');
const measureAreaButton = document.getElementById('btn-map-area');
measureLengthButton.addEventListener('mousedown', onClickMeasureButton);
measureAreaButton.addEventListener('mousedown', onClickMeasureButton);

function onClickMeasureButton(event) {
  event.preventDefault();

  measureType = event.target.value;

  switch (measureType) {
    case 'LineString':
      isLength = !isLength;
      measureLengthButton.classList.toggle('active', isLength);
      measureAreaButton.classList.toggle('active', false);
      break;
    case 'Polygon':
      isArea = !isArea;
      measureLengthButton.classList.toggle('active', false);
      measureAreaButton.classList.toggle('active', isArea);
      break;
    default:
      isLength = false;
      isArea = false;
      break;
  }

  removeOldInteraction();

  setNewInteraction();
}

function removeOldInteraction() {
  if (measureInteraction) {
    map.removeInteraction(measureInteraction);
    measureInteraction.reset();
    measureInteraction = null;
  }
}

function setNewInteraction() {
  if (isLength || isArea) {
    map.removeInteraction(selectInteraction);
    measureInteraction = new MeasureInteraction({
      map: map,
      type: measureType,
    });
    map.addInteraction(measureInteraction);
  } else {
    map.addInteraction(selectInteraction);
  }
}
