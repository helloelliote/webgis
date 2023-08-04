import Map from 'ol/Map';
import { Image, Vector } from './layer';
import { onMoveEnd, view } from './view';
import { addressOverlay, hoverOverlay } from './overlay';
import { default as defaultControls } from './control';
import { default as defaultInteractions, SelectInteraction, TransformInteraction } from './Interaction';
import {
  onClickTableCodeAside,
  onClickTableCodeTop,
  onContextMenu,
  onImageLayerUpdate,
  onSelectQuickSearch,
  onSelectQuickSearchSingleResult,
  onWindowLoad,
} from './event';
import { clickCoordinate, onAddClickOverlay } from './click';
import { DragRotateAndZoom, Snap } from 'ol/interaction';
import { isUndefined } from 'underscore';
import ModifyTouch from 'ol-ext/interaction/ModifyTouch';

const vectorLayer = new Vector();
vectorLayer.toggleLayers(window.webgis.table.vector);

// const vectorSpiLayer = new VectorSpi();
// vectorSpiLayer.toggleLayers(window.webgis.table.spi);

const imageLayer = new Image();
imageLayer.toggleLayers(window.webgis.table.image);

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

const selectInteraction = new SelectInteraction({
  map: map ,
});
map.addInteraction(selectInteraction);

const toggleModifyButton = document.getElementById('btn-toggle-modify');
const revert = document.getElementById('btn-back-modify');
let isModifyActive = false;
let modify;
let originalGeometries = {};

selectInteraction.on('select', (event) => {
  // Store the original geometries when a feature is selected
  event.selected.forEach((feature) => {
    originalGeometries[feature.getId()] = feature.getGeometry().clone();
  });
});

const obj1 = {
  '가정급수관': vectorLayer.getLayer('viw_wtl_pipe_lm').getSource(),
  '급수전': vectorLayer.getLayer('viw_wtl_sply_ls').getSource()
}

document.getElementById("btn-toggle-modify").onclick = function () {
  isModifyActive = !isModifyActive; // Toggle the modify active state //편집모드버튼 on,off
  if (isModifyActive) {
    // map.removeInteraction(selectInteraction)
    TransformInteraction.on('rotating', function (e){
      console.log(`라디안: ${e.angle}`);
      e.feature.set('방향각', (e.angle * (180 / Math.PI)).toFixed(2));//라디안 값을 60분법으로 전환
    });
    // TransformInteraction.on('select',function (e){
    //   e.feature
    // })

    const 그때그때_다른_지금_선택한_레이어 = selectInteraction["지금 선택한 레이어 코드"];

    toggleModifyButton.textContent = 'on';
    const snap = new Snap({
      source: vectorLayer.getLayer('viw_wtl_pipe_lm').getSource(),
      vertex: true,
      edge: true,
    });
    const snap2 = new Snap({
      source: vectorLayer.getLayer('viw_wtl_sply_ls').getSource(),
      vertex: true,
      edge: true,
    });
    const snap3 = new Snap({
      source: vectorLayer.getLayer('viw_wtl_meta_ps').getSource(),
      vertex: true,
      edge: true,
    });
    const snap4 = new Snap({
      source: vectorLayer.getLayer('viw_wtl_pipe_close_lm').getSource(),
      vertex: true,
      edge: true,
    });
    modify = new ModifyTouch({
      features:selectInteraction.getFeatures(),
      title: '점 제거',
  })
    revert.addEventListener('click', () => {
      selectInteraction.getFeatures().forEach((feature) => {
        const originalGeometry = originalGeometries[feature.getId()];
        if (originalGeometry&&isModifyActive) {
          feature.setGeometry(originalGeometry.clone());
        }
        console.log("실행취소",originalGeometry);
      });
    });
    map.addInteraction(modify),
    map.addInteraction(TransformInteraction);
    map.addInteraction(snap)
    map.addInteraction(snap2)
    map.addInteraction(snap3)
    map.addInteraction(snap4)
  } else {
    map.removeInteraction(TransformInteraction);
    if (modify) {
      // modify.setActive(false)
      map.removeInteraction(modify);
      // modify = undefined
    }
    toggleModifyButton.textContent = 'off';
  }
};
map.addOverlay(addressOverlay);
map.addOverlay(hoverOverlay);

//클릭한 위치의 좌표를 가져오기위한 이벤트
map.on('pointermove', clickCoordinate);
//다중 피쳐 선택 이벤트
selectInteraction.on('select', onAddClickOverlay);

map.on('contextmenu', onContextMenu);

// map.on('pointermove', onPointerMove.bind({ layer: vectorLayer.getLayer('viw_wtl_pipe_dir_ps'), map }));

map.on('moveend', onMoveEnd);

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


