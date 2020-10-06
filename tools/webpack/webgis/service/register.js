'use strict';

const ServiceRegister = function () {

  let validation;
  // Form elements
  let _form;
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

  const _initForm = function () {
    _form_reg_idn = _form.find('input[name="reg_idn"]');
    // _form_reg_idn.val('초기값');
    $(_form).on('reset', function () {
      let _id = _form_reg_idn.val();
      setTimeout(() => _form_reg_idn.val(_id));
    });
  };

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

    $('#kt_datetimepicker_1').on('change.datetimepicker', function () {
      validation.revalidateField('reg_ymd');
    });

    $('#kt_inputmask_3').on('change', _revalidateField);

    $('#input_reg_loc').on('change', _revalidateField);
  };

  const _revalidateField = function (event) {
    validation.revalidateField(event.target.name);
  };

  const _handleForm = function () {
    $(_submit).on('click', function (event) {
      event.preventDefault();

      validation.validate().then(function (status) {
        if (status === 'Valid') {
          _form.ajaxSubmit({
            url: `${window.location.origin}/service/register`,
            method: 'POST',
            headers: {
              'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
            },
            success: function (response, status, xhr, $form) {
              setTimeout(function () {
                console.log(response);
              }, 150);
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

  // Public functions
  return {
    init: function () {
      _form = $('#service_register_form');

      _submit = KTUtil.getById('service_register_form_submit');

      _initForm();
      _initValidation();
      _handleForm();
    },
  };
}();

jQuery(document).ready(function () {
  ServiceRegister.init();
});
