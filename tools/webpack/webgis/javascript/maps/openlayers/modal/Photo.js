import { default as ModalOverlay } from './Modal';

export default class PhotoModal extends ModalOverlay {

  constructor(element) {
    super(element);

    let that = this;

    this.addElements([
      '.carousel-inner',
      '.carousel-item',
      '.carousel-item img',
      '.carousel-item button',
    ]);

    this._modalEl.on('hidden.bs.modal', function () {
      that['.carousel-inner'].children().slice(1).remove();
    });
  }

  setFeatureAsync(feature) {
    super.setFeature(feature);

    let that = this;
    let _layer = that.getFeature('layer');
    let _id = that.getFeature('id');
    return new Promise((resolve, reject) => {
      that._ajaxWorker.fetch('wtl/info/photo', {
        table: _layer === '보수공사' ? 'viw_wtt_subimge_et_re' : 'viw_wtt_st_image',
        layer: that.getFeature('layerSub').replace('블럭', ''),
        id: _id,
      }, 'image/jpg')
        .then(updateCarousel)
        .then(hasPhoto => {
          if (hasPhoto) {
            resolve(that);
          } else {
            reject(`${_layer} (관리번호: ${_id}) 에 등록된 사진이 없습니다`);
          }
        })
        .catch((err) => reject(`사진을 불러오지 못하였습니다<br>(${err})`));
    });

    function updateCarousel(result) {
      if (result && result.length > 0) {
        that['.card-title h3'].html(feature.get(`${_layer}명`) ? feature.get(`${_layer}명`) : _layer);
        for (let i = 0, len = result.length; i < len; i++) {
          const title = `사진${result[i]['사진일련번호']}:&nbsp;${result[i]['사진명칭']}`;
          const image = result[i]['사진'];
          if (i === 0) {
            if (image !== null) {
              that['.carousel-item img'].attr('src', image);
              that['.carousel-item button'].html(title);
              that['.carousel-item button'].on('click', () => {
                window.open(image, 'Popup', 'location, resizable');
              });
            } else {
              that['.carousel-item img'].attr('src', './assets/media/bg/bg-9.jpg');
              that['.carousel-item button'].html('등록된 사진이 없습니다');
            }
            that['.carousel-item'].addClass('active');
          } else {
            const _node = that['.carousel-item'].clone();
            _node.removeClass('active');
            _node.find('img').attr('src', image);
            _node.find('div > button').html(title);
            _node.find('div > button').on('click', () => {
              window.open(image, 'Popup', 'location, resizable');
            });
            that['.carousel-inner'].append(_node);
          }
        }
        return true;
      }
      return false;
    }
  }
}
