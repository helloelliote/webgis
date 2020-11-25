import Ajax from '../worker/Ajax';
import AjaxWorker from '../worker/ajax.worker';

export default class ModalOverlay {

  constructor(element) {
    let that = this;

    this._modalEl = $(`#${element}`);
    this._cardEl = this._modalEl.find('.card');
    this._cardHeader = this._cardEl.find('.card-header');
    this._cardBody = this._cardEl.find('.card-body');
    this._cardFooter = this._cardEl.find('.card-footer');
    this._cardFooterBtn = this._cardFooter.find('a.btn');
    this._cardOverlay = this._cardEl.find('.overlay-layer');

    this._cardTitle = this._cardHeader.find('#card_header_title');
    this._cardBadge = this._cardHeader.find('#card_header_badge');
    this._cardBadgeText = this._cardHeader.find('#card_badge_text');
    this._tbody = this._cardBody.find('tbody');

    this._getLayer = function (feature) {
      return (feature.get('레이어') || feature.get('layer') || feature.get('시설물구분') || '').trim();
    };

    this._ajaxWorker = new Ajax(new AjaxWorker());

    this._featureMap = new Map();
    this._interaction = null;

    this._modalEl.on('hidden.bs.modal', function () {
      that._featureMap.clear();
      that._interaction.getFeatures().clear();
    });
    this._cardFooterBtn.on('mousedown', this.onClickButton.bind(this));
  }

  setFeature(feature) {
    this._featureMap.set('feature', feature);
    this._featureMap.set('layer', this._getLayer(feature));
    this._featureMap.set('layerSub', this._getLayer(feature) === '보수공사' ? feature.get('시설물구분') : this._getLayer(feature));
    this._featureMap.set('id', feature.get('관리번호') || feature.get('ftr_idn'));
    this._featureMap.set('table', feature.get('layer') || feature.getId().match(/[^.]+/)[0]);
    this._featureMap.set('isClosed', feature.get('폐관일자') !== null && feature.get('폐관일자') !== undefined);
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

  addInteraction(interaction) {
    this._interaction = interaction;
  }

  removeInteraction() {
    this._interaction = null;
  }

  onClickButton(event) {
    event.preventDefault();
  }
}
