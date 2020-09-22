import Overlay from 'ol/Overlay';

const addressOverlay = new Overlay({
  element: document.getElementById('popup'),
});

const addressOverlayElement = addressOverlay.getElement();

$(addressOverlayElement).popover({
  container: addressOverlayElement,
  placement: 'auto',
});

Overlay.prototype.popover = function (options) {
  $(addressOverlayElement).popover(options);
};

$(addressOverlayElement).on('shown.bs.popover', function () {
  $(addressOverlayElement).focus();
});

$(addressOverlayElement).on('hidden.bs.popover', function () {
  addressOverlay.setPosition(undefined);
});

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
});

export default addressOverlay;
