import { default as ModalOverlay } from './Modal';

export default class PhotoModal extends ModalOverlay {

  constructor(element) {
    super(element);

    this.addElements([
      '.carousel-inner',
      '.carousel-item',
      '.carousel-item img',
      '.carousel-item button',
    ]);
  }

  setFeatureAsync(feature) {
    super.setFeature(feature);

    let that = this;
    let _layer = that.getFeature('layer');
    let _id = that.getFeature('id');
    return new Promise((resolve, reject) => {
      that._ajaxWorker.fetch('wtl/info/photo', {
        table: _layer === '보수공사' ? 'viw_swt_subimge_et' : 'viw_wtt_st_image',
        layer: that.getFeature('layerSub').replace('블럭', ''),
        id: _id,
      }, 'image/jpg')
        .then(updateModal)
        .then(hasPhoto => {
          if (hasPhoto) {
            resolve(that);
          } else {
            reject(`${_layer} (관리번호: ${_id}) 에 등록된 사진이 없습니다`);
          }
        })
        .catch((err) => reject(`사진을 불러오지 못하였습니다<br>(${err})`));
    });

    function updateModal(result) {
      if (result?.length > 0) {
        that['.card-title h3'].html(feature.get(`${_layer}명`) ? feature.get(`${_layer}명`) : _layer);
        that.updateCarousel(result);
        return true;
      } else return false;
    }
  }
}
