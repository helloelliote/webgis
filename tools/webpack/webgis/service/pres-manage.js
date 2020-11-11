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
      filename: moment().format('YYYYMMDD') + '_가압장 관리업체 현황',
      messageTop: moment().format('llll'),
      title: '가압장 관리업체 현황',
    };
  };

  const _initTable = function () {
    if (_table) return;
    
    _table = $('#kt_datatable_pres').DataTable({
      responsive: true,

      language: {
        'url': '//cdn.datatables.net/plug-ins/1.10.21/i18n/Korean.json',
      },

      ajax: {
        url: `${window.location.origin}/service/presmanage`,
        headers: {
          'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
        },
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            '가압장명', '관리업체', '연락처(대표)', '연락처(현장소장)',
          ],
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
      paging: true,
      info: false,
      order: [[0, 'asc']],
      buttons: [
        $.extend(true, {}, _tableButtonOpts, {
          extend: 'excelHtml5',
        }),
      ],
    });

    $('#export_excel_pres').on('click', function (e) {
      e.preventDefault();
      _table.button(0).trigger();
    });
  };

  return {

    //main function to initiate the module
    init: function () {
      const _modal = $('#exampleModal2');

      _modal.on('shown.bs.modal', () => {
        _init();
        _initTable();
      });
    },

  };

}();

jQuery(document).ready(function () {
  PresManage.init();
});
