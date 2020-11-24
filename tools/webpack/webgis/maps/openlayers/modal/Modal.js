import Ajax from '../worker/Ajax';
import AjaxWorker from '../worker/ajax.worker';
import MapError from '../../Error';

export default class ModalOverlay {

  constructor(element) {
    this._featureMap = new Map();

    this._modalEl = $(`#${element}`);
    this._cardEl = this._modalEl.find('.card');
    this._cardHeader = this._cardEl.find('.card-header');
    this._cardBody = this._cardEl.find('.card-body');
    this._cardFooter = this._cardEl.find('.card-footer');
    this._cardOverlay = this._cardEl.find('.overlay-layer');

    this._cardTitle = this._cardHeader.find('#card_header_title');
    this._cardBadge = this._cardHeader.find('#card_header_badge');
    this._cardBadgeText = this._cardHeader.find('#card_badge_text');
    this._tbody = this._cardBody.find('tbody');

    this._modalEl.on('show.bs.modal', function () {
      if (this._tbody) this._tbody[0].scrollIntoView();
    });

    this._getLayer = function (feature) {
      return (feature.get('레이어') || feature.get('layer') || feature.get('시설물구분') || '').trim();
    };

    this._ajaxWorker = new Ajax(new AjaxWorker());

    this._buttons = this._cardFooter.find('.btn');
    this._buttons.on('mousedown', this.onClickButton);
  }

  setContent(data) {
    if (!data) throw new MapError('No Feature');
    this._featureMap.set('layer', this._getLayer(data));
    this._featureMap.set('layerSub', this._getLayer(data) === '보수공사' ? data.get('시설물구분') : this._getLayer(data));
    this._featureMap.set('id', data.get('관리번호') || data.get('ftr_idn'));
    this._featureMap.set('table', data.get('layer') || data.getId().match(/[^.]+/)[0]);
    this._featureMap.set('isClosed', data.get('폐관일자') !== null && data.get('폐관일자') !== undefined);
    this._featureMap.set('geom', data.getGeometry());
  }

  getFeature(key) {
    return this._featureMap.get(key);
  }

  showModal() {
    this._modalEl.modal('show');
  }

  hideModal() {
    this._modalEl.modal('hide');
  }

  onClickButton(event) {
    event.preventDefault();
  }
}
