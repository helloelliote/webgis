import { getCenter } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import { default as geoJson } from './format';
import { default as projection } from './projection/Projection';

const mapContainer = document.getElementById('map-container');
const centerX = Math.round(mapContainer.clientWidth / 2);
const centerY = Math.round(mapContainer.clientHeight / 2);

function onClickTopbarLogo(event) {
  event.preventDefault();
  const [lng, lat] = [window.webgis.center.longitude, window.webgis.center.latitude];
  const center = fromLonLat([lng, lat], projection);
  this.setCenter(center);
}

function onClickQuickSearchInline(event) {
  event.preventDefault();
  let targetEl = event.target;
  if (targetEl) {
    if (targetEl.className.includes('quick-search-result-facility')) {
      const coordinate = targetEl.nextElementSibling.innerHTML;
      const feature = geoJson.readFeature(coordinate);
      const extent = getCenter(feature.getGeometry().getExtent());
      this.centerOn(extent, [100, 100], [centerX, centerY]);
    } else if (targetEl.className.includes('quick-search-result-address')) {
      const lagLng = targetEl.nextElementSibling.innerHTML.split(',');
      const [lng, lat] = [lagLng[0], lagLng[1]];
      const coords = fromLonLat([lng, lat], projection);
      this.setCenter(coords);
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

function onClickTableCode(event) {
  event.preventDefault();
  const targetEl = event.target;
  const elementId = targetEl.id;

  if (this.hasLayer(elementId)) {
    targetEl.classList.add('fa-times-circle', 'text-danger');
    targetEl.classList.remove('fa-check-circle', 'text-primary');
  } else {
    targetEl.classList.add('fa-check-circle', 'text-primary');
    targetEl.classList.remove('fa-times-circle', 'text-danger');
  }
  this.toggleLayers([elementId]);
}

function onWindowLoad(event) {
  event.preventDefault();

  const menuNavEl = document.querySelector('.menu-nav');

  let menuLabelEl = menuNavEl.querySelectorAll('span.menu-label > i.ol-table-code-wtl');
  menuLabelEl.forEach(element => {
    if (this.hasLayer(element.id)) {
      element.classList.add('far', 'fa-check-circle', 'text-primary', 'icon-lg');
    } else {
      element.classList.add('far', 'fa-times-circle', 'text-danger', 'icon-lg');
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
    default:
      break;
  }
}

export {
  onClickTopbarLogo,
  onClickQuickSearchInline,
  onClickSectionCode,
  onClickTableCode,
  onWindowLoad,
};
