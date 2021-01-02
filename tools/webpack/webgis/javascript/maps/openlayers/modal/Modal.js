export default class ModalOverlay {

  constructor(element) {
    this._modalEl = $(`${element}`);

    this._getLayer = function (feature) {
      return (feature.get('레이어') || feature.get('layer') || feature.get('시설물구분') || '').trim();
    };

    this._getLayerSub = function (feature) {
      return (feature.get('시설물구분') || this._getLayer(feature))
        .replace(/역지변|이토변|배기변|감압변|안전변/g, '제수변')
        .replace('블럭', '')
        .trim();
    };

    this._featureMap = new Map();
  }

  addElements(selectors) {
    selectors.forEach(selector => {
      this[selector] = this._modalEl.find(selector);
    }, this);
  }

  getFeature(key) {
    return this._featureMap.get(key);
  }

  setFeature(feature) {
    this._featureMap.set('layer', this._getLayer(feature));
    this._featureMap.set('id', feature.get('관리번호') || feature.get('ftr_idn'));
  }

  showModal() {
    this._modalEl.modal('show');
  }

  hideModal() {
    this._modalEl.modal('hide');
  }

  updateCarousel(data) {
    for (let i = 0, len = data.length; i < len; i++) {
      const title = `사진${data[i]['사진일련번호']}:&nbsp;${data[i]['사진명칭']}`;
      const imageBlob = data[i]['사진'];
      this._imageBlobSet.add(imageBlob);
      if (i === 0) {
        this['.carousel-item img'].attr('src', imageBlob);
        this['.carousel-item button'].html(title);
        this['.carousel-item button'].on('mousedown', () => {
          window.open(imageBlob, 'Popup', 'location, resizable');
        });
        this['.carousel-item'].addClass('active');
      } else {
        const _node = this['.carousel-item'].clone();
        _node.removeClass('active');
        _node.find('img').attr('src', imageBlob);
        _node.find('div > button').html(title);
        _node.find('div > button').on('mousedown', () => {
          window.open(imageBlob, 'Popup', 'location, resizable');
        });
        this['.carousel-inner'].append(_node);
      }
    }
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
}
