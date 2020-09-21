/* eslint-disable no-undef */

import { coordsToLatLng } from './Map';

const service = naver.maps.Service;

function onContextMenu(event) {
  event.preventDefault();
  coordsToLatLng(event.coordinate)
    .then(convertCoordinateToAddress)
    .then(createAddressHtmlElement)
    .catch(() => {});
}

function convertCoordinateToAddress(latLng) {
  return new Promise((resolve) => {
    service.reverseGeocode({ coords: latLng, orders: 'addr,roadaddr' }, (status, res) => {
      if (status === naver.maps.Service.Status.OK) {
        resolve(res['v2']['address']);
      }
    });
  });
}

function createAddressHtmlElement(result) {
  const content = [];
  if (result['roadAddress'] !== '') {
    content.push(`도로명 주소: ` + `<a href="#" class="addr-clipboard">${result['roadAddress']}</a>`);
  }
  if (result['jibunAddress'] !== '') {
    content.push(`지  번 주소: ` + `<a href="#" class="addr-clipboard">${result['jibunAddress']}</a>`);
  }
  content.join('<br />');
  // TODO: Setup popover to display content results
}

export {
  onContextMenu,
};
