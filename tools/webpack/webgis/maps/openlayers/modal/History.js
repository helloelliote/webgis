import { default as ModalOverlay } from './Modal';

class HistoryModal extends ModalOverlay {
  
  constructor(element) {
    super(element);
  }
}

const historyModal = new HistoryModal('kt_history_modal');

export default historyModal;
