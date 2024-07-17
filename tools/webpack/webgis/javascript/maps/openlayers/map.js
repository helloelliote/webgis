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
  onSelectQuickSearch,
  onSelectQuickSearchSingleResult,
  onWindowLoad,
} from './event';
import { FileExport } from './file';
import { default as dev } from './_dev_';
// import {DXFWriter} from 'dxf-writer'
import {saveAs} from 'file-saver'
import JSZip from 'jszip';
import { Fill, Stroke, Style } from 'ol/style';
import { GeoJSON } from 'ol/format';
import VectorSource from 'ol/source/Vector';

const vectorLayer = new Vector();
vectorLayer.toggleLayers(window.webgis.table.vector);

// const vectorSpiLayer = new VectorSpi();
// vectorSpiLayer.toggleLayers(window.webgis.table.spi);

const imageLayer = new Image();
imageLayer.toggleLayers(window.webgis.table.image);

const vectorSource = new VectorSource({
  format: new GeoJSON(),
});

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

function geojsonToDXF(features) {
  let dxf = '0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';

  features.forEach((feature) => {
    const geojson = new GeoJSON().writeFeatureObject(feature);
    const geometry = geojson.geometry;

    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      const coordinates = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
      coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          for (let i = 0; i < ring.length - 1; i++) {
            const [x1, y1] = ring[i];
            const [x2, y2] = ring[i + 1];
            dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y1}\n30\n0\n11\n${x2}\n21\n${y2}\n31\n0\n`;
          }
        });
      });
    } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
      const coordinates = geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates;
      coordinates.forEach(line => {
        for (let i = 0; i < line.length - 1; i++) {
          const [x1, y1] = line[i];
          const [x2, y2] = line[i + 1];
          dxf += `0\nLINE\n8\n0\n10\n${x1}\n20\n${y1}\n30\n0\n11\n${x2}\n21\n${y2}\n31\n0\n`;
        }
      });
    } else if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
      const coordinates = geometry.type === 'Point' ? [geometry.coordinates] : geometry.coordinates;
      coordinates.forEach(point => {
        const [x, y] = point;
        dxf += `0\nPOINT\n8\n0\n10\n${x}\n20\n${y}\n30\n0\n`;
      });
    }
  });

  dxf += '0\nENDSEC\n0\nSECTION\n2\nOBJECTS\n0\nENDSEC\n0\nEOF\n';
  return dxf;
}

// Function to get features in the current view extent
function getFeaturesInView() {
  const extent = map.getView().calculateExtent(map.getSize());
  return vectorSource.getFeaturesInExtent(extent);
}

// Button click handler for downloading CAD file
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', async function () {
  const featuresInView = getFeaturesInView();
  const dxfContent = geojsonToDXF(featuresInView);

  // Create a zip file with JSZip
  const zip = new JSZip();
  zip.file('features.dxf', dxfContent);

  // Generate and download the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${moment().format('YYMMDD')}_features.zip`);
});

map.addOverlay(addressOverlay);
map.addOverlay(hoverOverlay);

const selectInteraction = new SelectInteraction({ map: map });

map.addInteraction(selectInteraction);

// const fileImport = new FileImport({ map, view });
const fileExport = new FileExport({ map, view, vectorLayer });

// document.getElementById('btn-dev-export')
//   .addEventListener('mousedown', async (event) => {
//     fileExport._onClickElement = event.target;
//     const typeName = 'viw_wtl_meta_ps';
//     const fileName = 'viw_wtl_pipe_lm'
//     await fileExport.exportDxf(typeName, fileName, event.target);
//   });

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

dev.isDevModeEnabled(false, { map, view, vectorLayer, imageLayer, selectInteraction });

export {
  map,
  selectInteraction,
};
