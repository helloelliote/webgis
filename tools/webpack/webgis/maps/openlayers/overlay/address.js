import Overlay from 'ol/Overlay';

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

Overlay.prototype.setContent = function (html) {
  content.innerHTML = html;
};

const addressOverlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 0,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  addressOverlay.setPosition(undefined);
  closer.blur();
  return false;
};

$(document).on('click', '.addr-clipboard', function (event) {
  event.stopPropagation();
  const el = document.createElement('textarea');
  el.value = $(this).text() || '';
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  addressOverlay.setPosition(undefined);
  // customOverlay.olAddress.fire({
  //   icon: 'success',
  //   titleText: '선택한 주소가 클립보드에 저장되었습니다'
  // });
});

export default addressOverlay;
