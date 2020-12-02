import Ajax from '../worker/Ajax';
import AjaxWorker from '../worker/ajax.worker';

export default class ModalOverlay {

  constructor(element) {
    this._modalEl = $(`#${element}`);

    this.addElements([
      '.card-title h3',
      '.card-title span',
      '.card-body tbody',
      '.card-footer a.btn',
      '.overlay-layer',
    ]);

    this._getLayer = function (feature) {
      return (feature.get('레이어') || feature.get('layer') || feature.get('시설물구분') || '').trim();
    };

    this._ajaxWorker = new Ajax(new AjaxWorker());

    this._featureMap = new Map();
    this._interaction = null;

    let that = this;
    this._modalEl.on('hidden.bs.modal', function () {
      that._featureMap.clear();
      if (that._interaction) that._interaction.getFeatures().clear();
    });

    this['.card-footer a.btn'].on('mousedown', this.onClickButton.bind(this));
  }

  addElements(elements) {
    let that = this;
    elements.forEach(element => {
      that[element] = that._modalEl.find(element);
    });
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
