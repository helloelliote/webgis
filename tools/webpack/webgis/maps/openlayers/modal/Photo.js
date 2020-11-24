import { default as ModalOverlay } from './Modal';

class PhotoModal extends ModalOverlay {

  constructor(element) {
    super(element);
  }
}

const photoModal = new PhotoModal('kt_photo_modal');

export default photoModal;
