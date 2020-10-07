/* eslint-disable no-undef */
'use strict';

const ServiceRegister = function () {

  let validation;
  let isPending = false;
  // Form elements
  let _card;
  let _form;
  let _overlay;
  let _form_reg_idn;
  // let _form_reg_idn;
  // let _form_reg_usr;
  // let _form_reg_ymd;
  // let _form_reg_nam;
  // let _form_reg_con;
  // let _form_reg_loc;
  // let _form_reg_cde;
  // let _form_rep_nam;
  // let _form_rep_com;
  let _submit;
  // Form values

  const _initValidation = function () {
    validation = FormValidation.formValidation(
      KTUtil.getById('service_register_form'),
      {
        fields: {
          'reg_usr': { validators: { notEmpty: { message: '필수 입력' } } },
          'reg_ymd': { validators: { notEmpty: { message: '필수 입력' } } },
          'reg_nam': { validators: { notEmpty: { message: '필수 입력' } } },
          'reg_con': { validators: { notEmpty: { message: '필수 입력' } } },
          'reg_loc': { validators: { notEmpty: { message: '필수 입력' } } },
          'reg_cde': { validators: { notEmpty: { message: '필수 입력' } } },
          'rep_nam': { validators: { notEmpty: { message: '필수 입력' } } },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
        },
      },
    ).on('plugins.message.displayed', function (event) {
      event.messageElement.style.display = 'none';
    });

    _form.find('#kt_datetimepicker_1').on('change.datetimepicker', function () {
      validation.revalidateField('reg_ymd');
    });

    _form.find('input[name="reg_con"]').on('change', _revalidateField);

    _form.find('input[name="reg_loc"]').on('change', _revalidateField);
  };

  const _revalidateField = function (event) {
    validation.revalidateField(event.target.name);
  };

  const _initForm = function () {
    // Automatically adjust textarea height
    autosize(_form.find('textarea[name="rep_des"]'));

    // Generate registration id upon opening the page
    _form_reg_idn = _form.find('input[name="reg_idn"]');
    // _form_reg_idn.val('초기값');

    $(_form).on('reset', function () {
      // On form reset, remove all validation status as well
      validation.resetForm();
      // Save the id and re-fill it after the form resets
      let _id = _form_reg_idn.val();
      setTimeout(() => {
        _form_reg_idn.val(_id);
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
              console.log(response);
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
      _card = $('#card_2');
      _form = _card.find('form');
      _submit = _form.find('button[type="submit"]');
      _overlay = _card.find('.overlay-layer');

      _initValidation();
      _initForm();
      _handleForm();
    },
  };
}();

jQuery(document).ready(function () {
  ServiceRegister.init();
});
