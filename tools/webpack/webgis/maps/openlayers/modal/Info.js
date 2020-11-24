import { ModalOverlay, historyModal, photoModal } from './index';
import { featureNameFilter } from '../filter';

class InfoModal extends ModalOverlay {

  constructor(element) {
    super(element);
  }

  setContent(feature) {
    super.setContent(feature);

    let that = this;
    that._ajaxWorker.fetch('wtl/info', {
      table: that._featureMap.get('table'),
      id: that._featureMap.get('id'),
    }).then(formatTableRows)
      .then(tableRows => {
        that._cardTitle.html(`${that._featureMap.get('layer')} 정보`);
        if (that._featureMap.get('isClosed')) {
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
        break;
      }
      case 'btn_history_modal': {
        historyModal.showModal();
        break;
      }
      case 'btn_photo_modal': {
        photoModal.showModal();
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

const infoModal = new InfoModal('kt_chat_modal');

export default infoModal;
