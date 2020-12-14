/* eslint-disable no-undef */
import { formatSchedule } from '../format/register';
import { getDefaultCenter, onWindowResize } from '../../maps/kakao/util';
import { getAddressFromLatLng } from '../../maps/kakao/geoCoder';

export default class EditModal {

  constructor(id, x, y, callback) {
    let that = this;

    that._modalEl = $('#kt_service_edit_modal');
    that._card = that._modalEl.find('.card');
    that._cardOverlay = that._card.find('.overlay-layer');
    that._modalForm = that._modalEl.find('#service_edit_form');
    that._disabledForm = that._modalForm.find('.form-control[disabled]');
    that._csrfToken = $('meta[name=\'csrf-token\']').attr('content');

    ['apm_tel', 'apy_cde', 'lep_cde', 'opr_nam', 'pip_dip', 'pro_cde'].forEach(code => {
      that[code] = that._modalForm.find(`.form-control[name="${code}"]`);
    });

    function onSelectSuccess(res) {
      that['apm_tel'].inputmask('99[9]-999[9]-9999');

      const resultObj = res['rows'][0];
      for (const [key, value] of Object.entries(resultObj)) {
        that._modalForm.find(`.form-control[name="${key}"]`).val(value);
      }

      formatSchedule().then(select => {
        that['opr_nam'].html(select).val(resultObj['opr_nam']).selectpicker('refresh');
      });

      ['apy_cde', 'lep_cde', 'pip_dip', 'pro_cde'].forEach(code => {
        if (resultObj[code] !== null) {
          that[code].selectpicker('val', resultObj[code]);
        } else {
          that[code].parent().attr('hidden', true);
        }
      });
    }

    function onError(err) {
      that.toggleBlockOverlay(false);
      $.notify({
        message: `[오류] ${err.responseText}`,
      }, { type: 'danger', element: '#kt_service_edit_modal' });
    }

    $.ajax({
      url: `${window.location.origin}/service/search?api=editfor&id=${id}`,
      headers: { 'CSRF-Token': that._csrfToken },
      type: 'POST',
      success: onSelectSuccess,
      error: onError,
    });

    function onUpdateSuccess(res) {
      setTimeout(() => {
        that._modalEl.modal('hide');
        $.notify({
          message: '선택한 민원이 수정되었습니다',
        }, { type: 'success' });
        callback();
      }, 2000);
    }

    function onFormSubmit(event) {
      event.preventDefault();
      that.toggleBlockOverlay(true);
      that._disabledForm.removeAttr('disabled');
      that._modalForm.ajaxSubmit({
        url: `${window.location.origin}/service/search?api=editto&id=${id}`,
        method: 'POST',
        headers: { 'CSRF-Token': that._csrfToken },
        success: onUpdateSuccess,
        error: onError,
      },
      null,
      'json',
      null,
      );
    }

    that._modalEl.find('#kt_service_edit_submit').on('click', onFormSubmit);

    that._modalEl.find('#kt_service_edit_cancel').on('click', () => that._modalEl.modal('hide'));

    that._modalEl.on('shown.bs.modal', () => new EditModalMap().start(x, y));

    that._modalEl.on('hidden.bs.modal', () => {
      that.toggleBlockOverlay(false);
      that._disabledForm.attr('disabled', true);
      that._modalEl.modal('dispose');
    });
  }

  showModal() {
    this._modalEl.modal('show');
  }

  toggleBlockOverlay(boolean) {
    if (boolean) {
      this._card.addClass('overlay overlay-block');
      this._cardOverlay.css('display', 'flex');
    } else {
      this._card.removeClass('overlay overlay-block');
      this._cardOverlay.css('display', 'none');
    }
  }
}

class EditModalMap {

  constructor() {
    if (EditModalMap.exists) {
      return EditModalMap.instance;
    }
    EditModalMap.instance = this;
    EditModalMap.exists = true;

    let that = this;

    const mapOptions = {
      center: getDefaultCenter(),
      level: 3,
      draggable: true,
      disableDoubleClick: true,
      disableDoubleClickZoom: true,
      scrollwheel: true,
      tileAnimation: false,
    };

    const mapContainer = document.getElementById('search_map_modal');

    that.map = new kakao.maps.Map(mapContainer, mapOptions);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    that.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);
    that.map.setMinLevel(1);
    that.map.setMaxLevel(7);

    that.marker = new kakao.maps.Marker({
      map: that.map,
      position: that.map.getCenter(),
    });

    kakao.maps.event.addListener(that.map, 'click', that.onKakaoMapClick.bind(that));

    window.addEventListener('resize', onWindowResize.bind(that.map), { passive: true });

    return this;
  }

  start(x, y) {
    const defaultLatLng = new kakao.maps.LatLng(y, x);
    this.map.setCenter(defaultLatLng);
    this.marker.setPosition(defaultLatLng);
  }

  onKakaoMapClick(event) {
    let latLng = event.latLng;
    this.marker.setPosition(latLng);
    getAddressFromLatLng(latLng).then(function (response) {
      let address = response['address'];
      let road = response['road_address'];
      let jibun = address['address_name'];
      $('.form-control[name="apm_adr_road"]')
        .val(road !== null ? road['address_name'] : ' ')
        .change();
      $('.form-control[name="apm_adr_jibun"]')
        .val(jibun !== '' ? jibun : ' ')
        .change();

      $('.form-control[name="apl_hjd"]')
        .val(null);

      $('.form-control[name="apl_adr"]')
        .val(address['main_address_no'] + (address['sub_address_no'] === '' ? '' : '-' + address['sub_address_no']));

      $('#service_edit_form input[name="x"]')
        .val(latLng.getLng());

      $('#service_edit_form input[name="y"]')
        .val(latLng.getLat());
    });
  }
}
