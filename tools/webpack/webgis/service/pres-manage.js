'use strict';

import moment from 'moment';

const PresManage = function () {

  let _table;
  let _tableButtonOpts;

  const _init = function () {
    moment.locale('ko');

    _tableButtonOpts = {
      pageSize: 'A4',
      orientation: 'landscape',
      filename: moment().format('YYYYMMDD') + '_민원',
      messageTop: moment().format('llll'),
      title: '',
    };
  };

  const _initTable = function () {
    if (!_table) {

      _table = $('#kt_datatable_pres');

      _table.dataTable({
        responsive: true,

        language: {
          'url': '//cdn.datatables.net/plug-ins/1.10.21/i18n/Korean.json',
        },

        ajax: {
          url: `${window.location.origin}/service/presmanage`,
          headers: {
            'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
          },
        },
        columns: [
          { data: '가압장명' },
          { data: '관리업체' },
          { data: '연락처(대표)' },
          { data: '연락처(현장소장)' },
        ],

        processing: true,
        serverSide: false,
        autoWidth: true,
        scrollY: '450px',
        scroller: true,
        scrollCollapse: true,
        info: false,
        order: [[0, 'asc']],
        // FIXME: Export not working
        buttons: [
          $.extend(true, {}, _tableButtonOpts, {
            extend: 'print',
          }),
          $.extend(true, {}, _tableButtonOpts, {
            extend: 'excelHtml5',
          }),
        ],
      });

      $('#export_print_pres').on('click', function (e) {
        e.preventDefault();
        _table.button(0).trigger();
      });

      $('#export_excel_pres').on('click', function (e) {
        e.preventDefault();
        _table.button(1).trigger();
      });
    }
  };

  return {

    //main function to initiate the module
    init: function () {
      const _modal = $('#exampleModal2');

      _init();

      _modal.on('shown.bs.modal', () => {
        _initTable();
      });
    },

  };

}();

jQuery(document).ready(function () {
  PresManage.init();
});
