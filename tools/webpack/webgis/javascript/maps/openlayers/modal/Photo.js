import { default as ModalOverlay } from './Modal';
import { default as fetchWorker } from '../worker/fetch.wrapper';

export default class PhotoModal extends ModalOverlay {

  constructor(element) {
    super(element);

    this.addElements([
      '.card-title h3',
      '.carousel-inner',
      '.carousel-item',
      '.carousel-item img',
      '.carousel-item button',
    ]);

    this._imageBlobSet = new Set();

    let that = this;

    this._modalEl.on('hidden.bs.modal', function () {
      that._featureMap.clear();
      that._imageBlobSet.forEach(blob => URL.revokeObjectURL(blob));
      that._imageBlobSet.clear();
      that.resetCarousel();
    });
  }

  setFeature(feature) {
    super.setFeature(feature);
    this._featureMap.set('layerSub', this.getLayerSubName(feature));
  }

  setFeatureAsync(feature) {
    this.setFeature(feature);

    let that = this;
    let _layer = that.getFeature('layer');
    let _layerSub = that.getFeature('layerSub');
    _layerSub = _layerSub.match(/(.*받이)/g) !== null ? '물받이' : _layerSub;
    let _id = that.getFeature('id');
    return new Promise((resolve, reject) => {
      fetchWorker.fetch(`${window.webgis.role}/info/photo`, {
        table: _layer === '보수공사' ? window.webgis.table.repairPhoto : window.webgis.table.photo,
        layer: _layerSub,
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
