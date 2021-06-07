import Overlay from 'ol/Overlay';

Overlay.prototype.popover = function (options) {
  $(this.getElement()).popover(options);
};

const addressOverlay = new Overlay({
  element: document.getElementById('popup'),
});

const addressOverlayElement = addressOverlay.getElement();

$(addressOverlayElement).popover({ placement: 'auto' });

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
  $(addressOverlayElement).popover('hide');
  $.notify({
    message: '선택한 주소가 클립보드에 저장되었습니다',
  });
});

export default addressOverlay;
