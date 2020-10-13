/* eslint-disable no-undef */
'use strict';

const ServiceRegister = function () {

  let validation;
  let isPending = false;
  // Form elements
  let _card;
  let _form;
  let _submit;
  let _overlay;
  let _form_rcv_num;
  let _form_rcv_ymd;
  let _form_apm_tel;
  let _form_apl_cde;
  let _form_pip_dip;
  let _form_lep_cde;
  // Form values

  const _initValidation = function () {
    validation = FormValidation.formValidation(
      KTUtil.getById('service_register_form'),
      {
        fields: {
          'rcv_nam': { validators: { notEmpty: { message: '필수 입력' } } },
          'rcv_ymd': { validators: { notEmpty: { message: '필수 입력' } } },
          'apm_nam': { validators: { notEmpty: { message: '필수 입력' } } },
          'apm_tel': { validators: { notEmpty: { message: '필수 입력' } } },
          'apm_adr_road': { validators: { notEmpty: { message: '필수 입력' } } },
          'apm_adr_jibun': { validators: { notEmpty: { message: '필수 입력' } } },
          'pro_nam': { validators: { notEmpty: { message: '필수 입력' } } },
          'apy_cde': { validators: { notEmpty: { message: '필수 입력' } } },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
        },
      },
    ).on('plugins.message.displayed', function (event) {
      event.messageElement.style.display = 'none';
    });

    _form_rcv_ymd.on('change.datetimepicker', function () {
      validation.revalidateField('rcv_ymd');
    });

    _form_apm_tel.on('change', _revalidateField);
    _form.find('input[name="apm_adr_road"]').on('change', _revalidateField);
    _form.find('input[name="apm_adr_jibun"]').on('change', _revalidateField);
  };

  const _revalidateField = function (event) {
    validation.revalidateField(event.target.name);
  };

  const _initForm = function () {
    // Automatically adjust textarea height
    autosize(_form.find('textarea[name="apl_exp"]'));

    _form_rcv_ymd.datetimepicker({
      /**
       * @link https://tempusdominus.github.io/bootstrap-4/Options/#locale
       * */
      locale: window.moment.locale('ko'),
      format: 'YYYY-MM-DD HH:mm',
      buttons: {
        showToday: true,
      },
    });

    _form_apm_tel.inputmask('999-9999-9999', {
      oncomplete: function (event) {
        $(event.target).change();
      },
    });

    _form_pip_dip.inputmask('999', {
      numericInput: true,
    });

    _form_apl_cde.on('change', function (event) {
      if (event.target.value === '도로 누수') {
        _form_pip_dip.parent().css('display', 'block');
        _form_lep_cde.parents().eq(1).css('display', 'block');
      } else {
        _form_pip_dip.parent().css('display', 'none');
        _form_lep_cde.parents().eq(1).css('display', 'none');
        _form_pip_dip.val('');
        _form_lep_cde.val('default').selectpicker('refresh');
      }
    });

    // Generate registration id upon opening the page

    // _form_reg_idn.val('초기값');

    $(_form).on('reset', function () {
      // On form reset, remove all validation status as well
      validation.resetForm();
      // Save the id and re-fill it after the form resets
      let _id = _form_rcv_num.val();
      setTimeout(() => {
        _form_rcv_num.val(_id);
      }, 250);
    });
  };

  const _handleForm = function () {
    $(_submit).on('click', function (event) {
      event.preventDefault();

      validation.validate().then(function (status) {
        if (status === 'Valid') {
          _toggleBlockOverlay(isPending = true);

          _form.ajaxSubmit({
            url: `${window.location.origin}/service/register`,
            method: 'POST',
            headers: {
              'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
            },
            success: function (response, status, xhr, $form) {
              setTimeout(function () {
                _toggleBlockOverlay(isPending = false);
                console.log(response);
              }, 2500);
            },
            error: function (response, status, xhr, $form) {
            },
          },
          null,
          'json',
          null,
          );
        } else {
          KTUtil.scrollTop();
          $.notify({
            message: '필수 정보를 먼저 입력해주세요',
          }, { type: 'danger' });
        }
      });
    });
  };

  const _toggleBlockOverlay = function (boolean) {
    if (boolean) {
      _card.addClass('overlay overlay-block');
      _overlay.css('display', 'flex');
    } else {
      _card.removeClass('overlay overlay-block');
      _overlay.css('display', 'none');
    }
  };

  // Public functions
  return {
    init: function () {
      _card = $('#card_register');
      _form = _card.find('form');
      _submit = _form.find('button[type="submit"]');
      _overlay = _card.find('.overlay-layer');

      _form_rcv_num = _form.find('input[name="rcv_num"]');
      _form_rcv_ymd = _form.find('input[name="rcv_ymd"]').parent('.date');
      _form_apm_tel = _form.find('input[name="apm_tel"]');
      _form_apl_cde = _form.find('select[name="apy_cde"]');
      _form_pip_dip = _form.find('input[name="pip_dip"]');
      _form_lep_cde = _form.find('select[name="lep_cde"]');

      _initValidation();
      _initForm();
      _handleForm();
    },
  };
}();

jQuery(document).ready(function () {
  if (document.getElementById('card_register')) ServiceRegister.init();
});
