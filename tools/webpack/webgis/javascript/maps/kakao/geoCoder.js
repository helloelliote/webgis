import { coordinateToLatLng } from './util';

// const geoCoder = new kakao.maps.services.Geocoder();

function coordinateToAddress(coordinate) {
  return new Promise((resolve, reject) => {
    coordinateToLatLng(coordinate)
      .then(latLngToAddress)
      .then(addressToHtml)
      .then(content => {
        resolve(content);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function latLngToAddress(latLng) {
  return new Promise((resolve) => {
    // geoCoder.coord2Address(latLng.getLng(), latLng.getLat(), (res, status) => {
    //   if (status === kakao.maps.services.Status.OK) {
    //     resolve(res[0]);
    //   }
    // });
    $.ajax({
      url: 'https://dapi.kakao.com/v2/local/geo/coord2address.json',
      headers: {
        'Authorization': `KakaoAK ${window.webgis.kakao.rest}`,
      },
      data: {
        x: latLng.getLng(),
        y: latLng.getLat(),
      },
      dataType: 'json',
      success: function (res) {
        resolve(res['documents'][0]);
      },
    });
  });
}

function addressToHtml(address) {
  return new Promise((resolve) => {
    const htmlContent = [];
    if (address['road_address'] != null) {
      htmlContent.push(
        `도로명 주소: <a href="#" class="addr-clipboard">${address['road_address']['address_name']}</a>`,
      );
    }
    if (address['address']['address_name'] != null) {
      htmlContent.push(
        `지&nbsp;&nbsp;&nbsp;번 주소: <a href="#" class="addr-clipboard">${address['address']['address_name']}</a>`,
      );
    }
    resolve(htmlContent.join('<br />'));
  });
}

export {
  coordinateToAddress,
  latLngToAddress,
};
