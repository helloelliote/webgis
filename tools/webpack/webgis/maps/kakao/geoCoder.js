/* eslint-disable no-undef */

import { coordsToLatLng } from '../openlayers/projection/Projection';

const geoCoder = new kakao.maps.services.Geocoder();

function showAddressPopover(event) {
  event.preventDefault();
  coordsToLatLng(event.coordinate)
    .then(convertCoordinateToAddress)
    .then(createAddressHtmlElement)
    .catch(() => {});
}

function convertCoordinateToAddress(latLng) {
  return new Promise((resolve) => {
    geoCoder.coord2Address(latLng.getLng(), latLng.getLat(), (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(res[0]);
      }
    });
  });
}

function createAddressHtmlElement(result) {
  let roadAddress = result['road_address'];
  let lotAddress = result['address']['address_name'];
  let content;
  if (roadAddress) {
    content = `<p class="addr">도로명&nbsp;주소: <a href="#" class="addr-clipboard">${roadAddress['address_name']}</a></p>`;
    content += `<p class="addr">지&nbsp;&nbsp;&nbsp;&nbsp;번&nbsp;주소: <a href="#" class="addr-clipboard">${lotAddress}</a> </p>`;
  } else {
    content = `<p class="addr">지번&nbsp;주소: <a href="#" class="addr-clipboard">${lotAddress}</a> </p>`;
  }
  // TODO: Setup popover to display content results

  //         $(element).popover({
  //           animation: true,
  //           placement: 'auto',
  //           html: true,
  //           content: `<span>${content}</span>`,
  //           sanitize: true,
  //           trigger: 'focus click',
  //         });
  //         $(element).popover('show');
}

export {
  showAddressPopover,
};
