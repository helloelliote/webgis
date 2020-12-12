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
    this._featureMap.set('layerSub', feature.get('시설물구분') ? feature.get('시설물구분') : this._getLayer(feature));
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

  resetCarousel() {
    if (this['.carousel-inner']) {
      this['.carousel-inner'].children().slice(1).remove();
      this['.carousel-item img'].attr('src', './assets/media/bg/bg-yeongju.png');
      this['.carousel-item button'].html('등록된 사진이 없습니다');
      this['.carousel-item button'].off('mousedown');
      this['.carousel-item'].addClass('active');
    }
  }

  updateCarousel(data) {
    for (let i = 0, len = data.length; i < len; i++) {
      const title = `사진${data[i]['사진일련번호']}:&nbsp;${data[i]['사진명칭']}`;
      const image = data[i]['사진'];
      if (i === 0) {
        this['.carousel-item img'].attr('src', image);
        this['.carousel-item button'].html(title);
        this['.carousel-item button'].on('mousedown', () => {
          window.open(image, 'Popup', 'location, resizable');
        });
        this['.carousel-item'].addClass('active');
      } else {
        const _node = this['.carousel-item'].clone();
        _node.removeClass('active');
        _node.find('img').attr('src', image);
        _node.find('div > button').html(title);
        _node.find('div > button').on('mousedown', () => {
          window.open(image, 'Popup', 'location, resizable');
        });
        this['.carousel-inner'].append(_node);
      }
    }
  }
}