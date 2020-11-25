import { default as ModalOverlay } from './Modal';
// import { default as historyModal } from './History';
// import { default as photoModal } from './Photo';
import { featureNameFilter } from '../filter';
import { getCenter } from 'ol/extent';
import { view } from '../view';

export default class InfoModal extends ModalOverlay {

  constructor(options) {
    super(options);
  }

  setFeature(feature) {
    super.setFeature(feature);

    let that = this;
    that._ajaxWorker.fetch('wtl/info', {
      table: that.getFeature('table'),
      id: that.getFeature('id'),
    }).then(formatTableRows)
      .then(tableRows => {
        that._cardTitle.html(`${that.getFeature('layer')} 정보`);
        if (that.getFeature('isClosed')) {
          that._cardBadge.removeClass('label-success');
          that._cardBadge.addClass('label-danger');
          that._cardBadgeText.html(`&nbsp;폐관`);
          that._cardBadgeText.css('color', 'red');
        } else {
          that._cardBadge.removeClass('label-danger');
          that._cardBadge.addClass('label-success');
          that._cardBadgeText.html(`&nbsp;사용 중`);
          that._cardBadgeText.css('color', 'green');
        }
        that._tbody.html(tableRows);
        that._tbody[0].scrollIntoView();
      });

    return that;
  }

  onClickButton(event) {
    super.onClickButton(event);
    switch (event.target.id) {
      case 'btn_location': {
        this._interaction.selectFeature(this.getFeature('feature'));
        view.setCenter(getCenter(this.getFeature('feature').getGeometry().getExtent()));
        break;
      }
      case 'btn_history_modal': {
        // historyModal.showModal();
        break;
      }
      case 'btn_photo_modal': {
        // photoModal.showModal();
        break;
      }
      default: {
        break;
      }
    }
  }
}

function formatTableRows(response) {
  let _tableRowEl = '';
  JSON.stringify(response[0], function (key, value) {
    if (featureNameFilter.has(key)) {
      return undefined;
    }
    if (key === '') {
      _tableRowEl = '';
    } else {
      _tableRowEl += `<tr class="tr-striped"><th scope="row">${key}</th><td>${value}</td></tr>`;
    }
    return value;
  });
  return _tableRowEl;
}
