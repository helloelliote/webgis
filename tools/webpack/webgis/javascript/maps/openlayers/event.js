import { getCenter } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import { geoJson } from './format';
import { default as projection } from './projection';
// import { searchCoordinateToAddress } from '../naver/geoCoder';
import { coordinateToAddress } from '../kakao/geoCoder';
import { viewSyncOptions } from '../kakao/map';
import { addressOverlay } from './overlay';
import { selectInteraction } from './map';

const mapContainer = document.getElementById('map-container');
const centerX = Math.round(mapContainer.clientWidth / 2);
const centerY = Math.round(mapContainer.clientHeight / 2);

function onSingleClick() {
  // Do NOT use #preventDefault(), it blocks select interaction
  addressOverlay.popover('dispose');
}

function onContextMenu(event) {
  event.preventDefault();
  coordinateToAddress(event.coordinate)
    .then(htmlContent => {
      addressOverlay.popover('dispose');
      addressOverlay.setPosition(event.coordinate);
      addressOverlay.popover({
        placement: 'top',
        container: addressOverlay.getElement(),
        html: true,
        content: htmlContent,
      });
      addressOverlay.popover('show');
      $(addressOverlay.getElement()).find('.popover').addClass('popover-info');
    });
}

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-facility')) {
      const coordinate = targetEl.nextElementSibling.textContent;
      const feature = geoJson.readFeature(coordinate);
      const coords = getCenter(feature.getGeometry().getExtent());
      this.setCenter(coords);
      if (this.getZoom() < viewSyncOptions.zoom.base) {
        this.setZoom(viewSyncOptions.zoom.base + 1);
      }
      selectInteraction.addFeature(feature);
    } else if (targetEl.className.includes('quick-search-result-address')) {
      const latLng = targetEl.nextElementSibling.textContent.split(',');
      const [lng, lat] = [latLng[0], latLng[1]];
      const coords = fromLonLat([lng, lat], projection);
      this.setCenter(coords);
      setTimeout(() => {
        addressOverlay.popover('dispose');
        addressOverlay.setPosition(coords);
        addressOverlay.popover({
          placement: 'top',
          container: addressOverlay.getElement(),
          html: true,
          content: targetEl.textContent,
        });
        addressOverlay.popover('show');
        $(addressOverlay.getElement()).find('.popover').addClass('popover-info');
      }, 500);
      if (this.getZoom() < viewSyncOptions.zoom.base) {
        this.setZoom(viewSyncOptions.zoom.base + 1);
      }
    }
  }
}

function onClickSectionCode(event) {
  event.preventDefault();
  const elementId = event.target.id.split(':');
  const [table, column, section] = [elementId[0], elementId[1], elementId[2]];

  const view = this['view'];
  const size = this['size'];

  $.ajax({
    url: `${window.location.origin}/api/wtl/section`,
    headers: {
      'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
    },
    data: {
      table, column, section,
    },
    dataType: 'json',
    success: function (res) {
      let feature = geoJson.readFeature(res['rows'][0]['coordinate']);
      let extent = getCenter(feature.getGeometry().getExtent());
      view.centerOn(extent, size, [centerX, centerY]);
    },
  });
}

function onClickTableCodeAside(event) {
  event.preventDefault();
  const targetEl = event.target;
  // Do not allow toggle of ol-table-code-geo road/building tile layer & always show it
  if (targetEl.id === 'n3a_a0010000') return;

  if (this.hasLayer(targetEl.id)) {
    targetEl.classList.add('fa-times-circle', 'text-danger');
    targetEl.classList.remove('fa-check-circle', 'text-primary');
  } else {
    targetEl.classList.add('fa-check-circle', 'text-primary');
    targetEl.classList.remove('fa-times-circle', 'text-danger');
  }
  this.toggleLayers([targetEl.id]);
}

function onClickTableCodeTop(event) {
  event.preventDefault();
  const targetEl = event.target;
  // Do not allow toggle of ol-table-code-geo road/building tile layer & always show it
  if (targetEl.id === 'n3a_a0010000') return;

  if (this['layer'].hasLayer(targetEl.id)) {
    targetEl.classList.remove('active');
  } else {
    targetEl.classList.add('active');
  }
  this['layer'].toggleLayers([targetEl.id]);

  this['layer'].updateParamsByZoom(~~this['view'].getZoom());
}

function onImageLayerUpdate(event) {
  event.preventDefault();

  if (event.target.id === 'btn-map-hybrid') {
    this['layer'].toggleMapTypeId();
  }

  this['layer'].updateParamsByZoom(~~this['view'].getZoom());
}

function onWindowLoad(event) {
  event.preventDefault();

  const menuNavEl = document.querySelector('.menu-nav');

  menuNavEl.querySelector('#viw_wtt_wutl_ht').id = window.webgis.table.repair;

  let menuLabelEl = menuNavEl.querySelectorAll('span.menu-label > i.ol-table-code-wtl');
  menuLabelEl.forEach(element => {
    if (this.hasLayer(element.id)) {
      element.classList.add('fas', 'fa-check-circle', 'text-primary', 'icon-lg');
    } else {
      element.classList.add('fas', 'fa-times-circle', 'text-danger', 'icon-lg');
    }
  });
  let role = '상수'; // TODO: Add Role
  switch (role) {
    case '상수': {
      let menuItemEl = menuNavEl.querySelectorAll('li.menu-item-wtl');
      menuItemEl.forEach(element => {
        element.classList.add('menu-item-open');
      });
      break;
    }
    case '하수': {
      let menuItemEl = menuNavEl.querySelectorAll('li.menu-item-swl');
      menuItemEl.forEach(element => {
        element.classList.add('menu-item-open');
      });
      break;
    }
    default: {
      break;
    }
  }
}

export {
  onSingleClick,
  onContextMenu,
  onClickQuickSearchInline,
  onClickSectionCode,
  onClickTableCodeAside,
  onClickTableCodeTop,
  onImageLayerUpdate,
  onWindowLoad,
};
