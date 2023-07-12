import { map as olMap, selectInteraction } from './map';
import { Overlay } from 'ol';
import { view } from '../openlayers/view';
import { Modify, Select } from 'ol/interaction';
//Feature가 들어올 빈 array
const selected = [];
let overlay;

let currentMouseCoordinates;

//클릭 이벤트에 좌표를 얻어옴
function clickCoordinate(event) {
  currentMouseCoordinates = event.coordinate;
}

function onAddClickOverlay(event) {
  selectInteraction.set('multi', false, true);
  // console.log(selectInteraction.setProperties())
  const newcollection = selectInteraction.getFeatures(); // select 이벤트로 모든 feautre들을 불러옴
  console.log('step1', newcollection, view.getZoom());

  //불러온 피쳐들의 id,정보 들을 추출함
  const newcollection2 = newcollection.getArray().map(f => {
    const id = f.getId();
    const value = `${f.get('레이어')}(${f.get('관리번호')})`;
    const fac = f.get('연장')
    const featureArray = f;
    return { value, id, featureArray, fac };
  });
  console.log('step2', newcollection2);

  //추출한 feature들의 좌표정보를 빈array를 만듬
  const coordinates = [];
  newcollection.forEach(function (feature) {
    const coordinate = feature.getGeometry().getCoordinates();
    coordinates.push(coordinate);
  });

  console.log('확인', newcollection2.length, newcollection);
  selected.push(newcollection); //추출한 feature들의 좌표정보를 빈array에 넣어줌

  if (overlay) {
    olMap.removeOverlay(overlay);//클릭했을때 오버레이가 있으면 제거해줌
  }

  //오버레이가 들어갈 폼생성
  let container = document.createElement('div');
  container.classList.add('ol-popup-custom');

  let form = document.createElement('form');
  form.classList.add('popup-form');

  let label = document.createElement('label');
  label.textContent = '선택 옵션';

  newcollection2.forEach((value, index) => {
    let input = document.createElement('input');
    input.id = `option${index}`;
    input.type = 'radio';
    input.name = 'option';
    input.value = `option ${index + 1} ${value}`;
    input.label = 'option'
    // Add event listener to handle radio button selection
    input.addEventListener('click', () => {
      if (input.checked) {
        const newFeature = selectInteraction.getLayer(value.featureArray).getSource().getFeatureById(value.id);
        selectInteraction.getFeatures().clear();
        selectInteraction.getFeatures().push(newFeature);
        const selectzoom = view.getZoom();//선택했을때의 줌을 가져옴
        console.log("현재줌",selectzoom,newFeature)

        view.fit(newFeature.getGeometry(), {
          padding: [50, 50, 50, 50],
          callback: () => {
            const callBackZoom = view.getZoom();
            if (~~selectzoom === ~~callBackZoom) {
              view.setZoom(selectzoom);
            }
            console.log('콜백줌', view.getZoom());
            selectInteraction.onSelectFeature(newFeature);
            olMap.removeOverlay(overlay)
          },
        });
        console.log('뉴피쳐:', newFeature, selectInteraction);
        console.log('Selected option:', value, selectInteraction);
      } else {
        console.error('Feature not found with ID:', value.id);
      }
    });
    let optionLabel = document.createElement('label');
    optionLabel.textContent = value.value;
    optionLabel.setAttribute('for', `option${index}`);

    let optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');
    optionContainer.appendChild(input);
    optionContainer.appendChild(optionLabel);

    form.appendChild(optionContainer);
  });
  container.appendChild(form);

  //오버레이 옵션
  overlay = new Overlay({
    element: container,
    positioning: 'top-right',
    offset: [0, 0],
    stopEvent: true, // Allow events to propagate to the map
  });
  //feature의 개수가 1개 이상이고 급수전 이 나타나는 zoom레벨부터 overlay를 생성.
  if (coordinates.length > 1 && view.getZoom() >= 14.3) {
    overlay.setPosition(currentMouseCoordinates);//오버레이의 좌표를 지정
    olMap.addOverlay(overlay);
  }
  console.log("좌표:",coordinates,currentMouseCoordinates)

}

export {
  onAddClickOverlay, clickCoordinate,
};