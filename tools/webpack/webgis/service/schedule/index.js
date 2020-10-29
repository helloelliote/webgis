'use strict';

import moment from 'moment';

const ServiceSchedule = function () {

  let _table;
  let _modalTitle;
  let _modalFooter;
  let _tab1TableButtonOpts;

  const _init = function () {
    moment.locale('ko');

    _tab1TableButtonOpts = {
      pageSize: 'A4',
      orientation: 'landscape',
      filename: moment().format('YYYYMMDD') + '_민원',
      messageTop: moment().format('llll'),
      title: '',
    };
  };

  const _initTable = function () {
    if (!_table) {

      _table = $('#kt_datatable_schedule');

      _table.dataTable({
        responsive: true,
        
        ajax: {
          url: `${window.location.origin}/service/schedule`,
          headers: {
            'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
          },
          data: {
            data: {
              // parameters for custom backend script demo
              columnsDef: [
                '업체명', '비상근무기간', '대표자', '연락처(대표)', '현장소장', '연락처(현장)', '비고',
              ],
            },
          },
        },
        columns: [
          { data: '업체명' },
          { data: '비상근무기간' },
          { data: '대표자' },
          { data: '대표자_연락처' },
          { data: '현장소장' },
          { data: '현장소장_연락처' },
          { data: '비고' },
        ],

        autoWidth: true,
        searching: false,
        paging: false,
        info: false,
        order: [[1, 'asc']],
        // FIXME: Export not working
        buttons: [
          $.extend(true, {}, _tab1TableButtonOpts, {
            extend: 'print',
          }),
          $.extend(true, {}, _tab1TableButtonOpts, {
            extend: 'excelHtml5',
          }),
        ],
      });

      $('#export_print_schedule').on('click', function (e) {
        e.preventDefault();
        _table.button(0).trigger();
      });

      $('#export_excel_schedule').on('click', function (e) {
        e.preventDefault();
        _table.button(1).trigger();
      });
    }
  };
  
  const _initModalFooter = function () {
    setTimeout(function () {
      $.ajax({
        url: `${window.location.origin}/service/schedule/memo`,
        headers: {
          'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
        },
        dataType: 'json',
        success: function (res) {
          _modalTitle.html(`상수도 급수공사 대행업체 비상근무 편성 (${res[0]['SCH_MONT']})`);
          _modalFooter.html(res[0]['SCH_MEMO']);
        },
        error: function () {
        },
      });
    }, 250);
  };

  return {

    //main function to initiate the module
    init: function () {
      const _modal = $('#exampleModal');
      _modalTitle = _modal.find('.modal-title');
      _modalFooter = _modal.find('.modal-footer');

      _init();

      _modal.on('show.bs.modal', () => {
        _initTable();
        _initModalFooter();
      });
    },

  };

}();

jQuery(document).ready(function () {
  ServiceSchedule.init();
});
