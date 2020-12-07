import { default as ModalOverlay } from './Modal';
import { default as HistoryModal } from './History';
import { default as PhotoModal } from './Photo';
import { featureNameFilter } from '../filter';
import { getCenter } from 'ol/extent';
import { view } from '../view';

export default class InfoModal extends ModalOverlay {

  constructor(options) {
    super(options);

    this._photoModal = new PhotoModal('kt_photo_modal');
    this._historyModal = new HistoryModal('kt_history_modal');
  }

  setFeatureAsync(feature) {
    super.setFeature(feature);

    let that = this;
    return new Promise((resolve, reject) => {
      that._ajaxWorker.fetch('wtl/info', {
        table: that.getFeature('table'),
        id: that.getFeature('id'),
      }).then(updateTableRows)
        .then(updateTableHeader)
        .then(() => resolve(that))
        .catch(() => reject('정보를 표시할 수 없습니다'));
    });

    function updateTableRows(response) {
      let tableRow = '';
      JSON.stringify(response[0], function (key, value) {
        if (featureNameFilter.has(key)) return undefined;
        if (key === '') {
          tableRow = '';
        } else {
          tableRow += `<tr class="tr-striped"><th scope="row">${key}</th><td>${value}</td></tr>`;
        }
        return value;
      });
      return tableRow;
    }

    function updateTableHeader(tableRows) {
      that['.card-title h3'].html(`${that.getFeature('layer')} 정보`);
      if (that.getFeature('isClosed')) {
        that['.card-title span'].removeClass('label-success');
        that['.card-title span'].addClass('label-danger');
        that['.card-title span'].html(`&nbsp;폐관`);
      } else {
        that['.card-title span'].removeClass('label-danger');
        that['.card-title span'].addClass('label-success');
        that['.card-title span'].html(`사용 중`);
      }
      that['.card-body tbody'].html(tableRows);
      that['.card-body tbody'][0].scrollIntoView();
      return that;
    }
  }

  onClickButton(event) {
    super.onClickButton(event);
    switch (event.target.id) {
      case 'btn_location': {
        this._interaction.addFeature(this.getFeature('feature'));
        view.setCenter(getCenter(this.getFeature('feature').getGeometry().getExtent()));
        break;
      }
      case 'btn_history_modal': {
        let that = this;
        this._historyModal.setFeatureAsync(that.getFeature('feature')).then(modal => {
          modal.showModal();
        }, reject => $.notify({ message: reject }, { type: 'warning' }));
        break;
      }
      case 'btn_photo_modal': {
        let that = this;
        this._photoModal.setFeatureAsync(that.getFeature('feature')).then(modal => {
          modal.showModal();
        }, reject => $.notify({ message: reject }, { type: 'warning' }));
        break;
      }
      default: {
        break;
      }
    }
  }
}
