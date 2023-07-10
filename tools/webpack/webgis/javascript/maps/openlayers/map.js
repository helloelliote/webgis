import Map from 'ol/Map';
import { Image, Vector } from './layer';
import { onMoveEnd, view } from './view';
import { addressOverlay, hoverOverlay } from './overlay';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction } from './Interaction';
import {
  onClickTableCodeAside,
  onClickTableCodeTop,
  onContextMenu,
  onImageLayerUpdate,
  onPointerMove,
  onSelectQuickSearch,
  onSelectQuickSearchSingleResult,
  onWindowLoad,
} from './event';
import { clickCoordinate, onAddClickOverlay } from './click';
import { DragRotateAndZoom, KeyboardPan, Modify, Select, Snap } from 'ol/interaction';
import Collection from 'ol/Collection';
import { isUndefined } from 'underscore';
import Transform from 'ol-ext/interaction/Transform';

const vectorLayer = new Vector();
vectorLayer.toggleLayers(window.webgis.table.vector);

// const vectorSpiLayer = new VectorSpi();
// vectorSpiLayer.toggleLayers(window.webgis.table.spi);

const imageLayer = new Image();
imageLayer.toggleLayers(window.webgis.table.image);

const select = new Select({
  wrapX: false,
})

const map = new Map({
  target: 'map-openlayers',
  view: view,
  layers: [
    imageLayer.layers,
    vectorLayer.layers,
    // vectorSpiLayer.layers,
  ],
  controls: defaultControls,
  interactions: defaultInteractions,
  moveTolerance: 20,
});

const toggleModifyButton = document.getElementById('btn-toggle-modify');
let isModifyActive = true;

const interaction = new Transform({
  enableRotatedTransform: false,
  hitTolerance: 2,
  translateFeature: false,//편집모드 on,off
  scale: true,//extend 기능 대각
  rotate: true,//객체회전기능
  selection: true,//편집모드시 편집할려는 객체에 마우스 모양변함
  // keepAspectRatio: $("#keepAspectRatio").prop('checked') ? ol.events.condition.always : undefined,
  keepRectangle: true,//가능한 사각형을 유지하게만듬
  translate: true, // move기능
  stretch: true,//extend 기능 상하좌우
  // Get scale on points
})

document.getElementById("btn-toggle-modify").onclick = function () {
  isModifyActive = !isModifyActive; // Toggle the modify active state

  console.log("백터",vectorLayer);
  let startangle = 0;
  let startRadius = 10;
  let d=[0,100];
  function setHandleStyle(){}
  if (isModifyActive) {
    // modify = new Modify({
    //   features: select.getFeatures(),
    // });
    setHandleStyle();
    map.addInteraction(interaction);
    map.removeInteraction(selectInteraction)
    interaction.on('rotating', function (e){
      console.log(e.feature);
      console.log(`라디안: ${e.angle}`);
      e.feature.set('방향각', (e.angle * (180 / Math.PI)).toFixed(2));//라디안 값을 60분법으로 전환
    });
    toggleModifyButton.textContent = '편집중';
    const snap = new Snap({
      source: vectorLayer.getLayer('viw_wtl_sply_ls').getSource(),
      vertex: true,
      edge: false,
    });
    map.addInteraction(snap);
  } else {
    map.removeInteraction(interaction);
    map.addInteraction(selectInteraction)
    toggleModifyButton.textContent = '편집off';
    select.getFeatures().clear();
  }
};

map.addOverlay(addressOverlay);
map.addOverlay(hoverOverlay);

const selectInteraction = new SelectInteraction({ map: map });

map.addInteraction(selectInteraction);
//클릭한 위치의 좌표를 가져오기위한 이벤트
map.on('pointermove', clickCoordinate);
//다중 피쳐 선택 이벤트
selectInteraction.on('select', onAddClickOverlay);

map.on('contextmenu', onContextMenu);

// map.on('pointermove', onPointerMove.bind({ layer: vectorLayer.getLayer('viw_wtl_pipe_dir_ps'), map }));

map.on('moveend', onMoveEnd);

// map.on('singleclick', onSingleClick);

view.on('change:resolution', onImageLayerUpdate.bind({ layer: imageLayer, view }));

document.getElementById('btn-map-hybrid')
  .addEventListener('mousedown', onImageLayerUpdate.bind({ layer: imageLayer, view }), false);

// Fired when the DOM is ready which can be prior to images and other external content is loaded.
document.getElementById('kt_quick_search_inline')
  .addEventListener('click', onSelectQuickSearch.bind(view), false);

document.addEventListener('singleresult', onSelectQuickSearchSingleResult.bind(view), false);

// [...document.getElementById('ol-section-code-wtl').getElementsByClassName('dropdown-menu')].forEach(element => {
//   element.addEventListener('mousedown', onClickSectionCode.bind({ view: view, size: map.getSize() }), false);
// });

document.querySelectorAll('.ol-table-code-wtl').forEach(element => {
  element.addEventListener('mousedown', onClickTableCodeAside.bind(vectorLayer), false);
});

document.querySelectorAll('.ol-table-code-swl').forEach(element => {
  element.addEventListener('mousedown', onClickTableCodeAside.bind(vectorLayer), false);
});

document.querySelectorAll('.ol-table-code-geo').forEach(element => {
  element.addEventListener('mousedown', onClickTableCodeAside.bind(imageLayer), false);
});

document.querySelectorAll('.ol-table-code-geo-top').forEach(element => {
  element.addEventListener('mousedown', onClickTableCodeTop.bind({ layer: imageLayer, view }), false);
});

// Fired when the entire page loads, including its content (images, CSS, scripts, etc.)
window.addEventListener('load', onWindowLoad.bind(vectorLayer), false);

export {
  map,
  selectInteraction,
};
