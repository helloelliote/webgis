/* eslint-disable no-undef */
'use strict';

import moment from 'moment';
import { onClickSearch, onTab1MapShown, onTab2MapShown, setMapMarker } from './kakaoMap';

const ServiceSearch = function () {

  let _tab1Card;
  let _tab1Ribbon;
  let _tab1Table;
  let _tab1TableButtonOpts;
  let _tab1, _tab2;
  let _tab2Coordinates;

  $.fn.dataTable.Api.register('column().title()', function () {
    return $(this.header()).text().trim();
  });

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

  const _initTab1 = function () {

    // begin first tab
    _tab1Table = $('#kt_datatable').DataTable({
      responsive: true,

      // Pagination settings
      dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
      // read more: https://datatables.net/examples/basic_init/dom.html

      lengthMenu: [5, 10, 25, 50],

      pageLength: 10,

      language: {
        'url': '//cdn.datatables.net/plug-ins/1.10.21/i18n/Korean.json',
      },

      searchDelay: 150,
      processing: true,
      serverSide: false,
      ajax: {
        url: `${window.location.origin}/service/search`,
        type: 'POST',
        headers: {
          'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
        },
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            '번호', '접수자', '일자', '민원인', '연락처',
            '지번 주소', '도로명 주소', '접수내용', '진행상태', '민원상세', '대행업체', '기능', 'x', 'y',
          ],
        },
      },
      columns: [
        { data: '번호' },
        { data: '접수자' },
        { data: '일자' },
        { data: '민원인' },
        { data: '연락처' },
        { data: '지번 주소' },
        { data: '도로명 주소' },
        { data: '접수' },
        { data: '진행' },
        { data: '상세' },
        { data: '대행' },
        { data: '기능' },
        { data: 'x' },
        { data: 'y' },
      ],
      initComplete: function () {
        var thisTable = this;
        var rowFilter = $('<tr class="filter"></tr>').appendTo($(_tab1Table.table().header()));

        this.api().columns().every(function () {
          var column = this;
          var input;

          switch (column.title()) {
            case '번호':
            case '접수자':
            case '일자':
            case '민원인':
            case '연락처':
            case '지번 주소':
            case '도로명 주소':
              input = $(`<input type="text" class="form-control form-control-sm form-filter datatable-input" data-col-index="` + column.index() + `"/>`);
              break;

            case '접수내용':
              // noinspection NonAsciiCharacters
              var status = {
                '미분류': { title: '미분류', state: 'success' },
                '계량기 동파': { title: '계량기 동파', state: 'success' },
                '단수': { title: '단수', state: 'success' },
                '도로 누수': { title: '도로 누수', state: 'success' },
                '보호통 누수 및 교체': { title: '보호통 누수 및 교체', state: 'success' },
                '수질': { title: '수질', state: 'success' },
                '신규 급수 신청': { title: '신규 급수 신청', state: 'success' },
                '앵글밸브 고장': { title: '앵글밸브 고장', state: 'success' },
                '저수압': { title: '저수압', state: 'success' },
                '기타': { title: '기타', state: 'success' },
              };
              input = $(`<select class="form-control form-control-sm form-filter datatable-input" title="선택" data-col-index="` + column.index() + `">
										<option value="">선택</option></select>`);
              column.data().unique().sort().each(function (d, j) {
                $(input).append('<option value="' + d + '">' + status[d].title + '</option>');
              });
              break;

            case '진행상태':
              // noinspection NonAsciiCharacters
              status = {
                '미분류': { title: '미분류', state: 'label-light-primary' },
                '신청접수': { title: '신청접수', state: ' label-light-success' },
                '진행중': { title: '진행중', state: ' label-light-warning' },
                '처리보류': { title: '처리보류', state: ' label-light-danger' },
                '협조/이첩': { title: '협조/이첩', state: ' label-light-danger' },
                '처리완료': { title: '처리완료', state: ' label-light-danger' },
                '처리중단': { title: '처리중단', state: ' label-light-danger' },
              };
              input = $(`<select class="form-control form-control-sm form-filter datatable-input" title="선택" data-col-index="` + column.index() + `">
										<option value="">선택</option></select>`);
              column.data().unique().sort().each(function (d, j) {
                $(input).append('<option value="' + d + '">' + status[d].title + '</option>');
              });
              break;

            case '기능':
              var search = $(`<button class="btn btn-danger kt-btn btn-sm">검색</button>`);

              var reset = $(`<button class="btn btn-outline-secondary kt-btn btn-sm ml-1">삭제</button>`);

              $('<th>').append(search).append(reset).appendTo(rowFilter);

              $(search).on('click', function (e) {
                e.preventDefault();
                var params = {};
                $(rowFilter).find('.datatable-input').each(function () {
                  var i = $(this).data('col-index');
                  if (params[i]) {
                    params[i] += '|' + $(this).val();
                  } else {
                    params[i] = $(this).val();
                  }
                });
                $.each(params, function (i, val) {
                  // apply search params to datatable
                  _tab1Table.column(i).search(val ? val : '', false, false);
                });
                _tab1Table.table().draw();

                let rows = _tab1Table.rows({ search: 'applied' }).data();

                _tab1Ribbon.find('strong').html(rows.length);
                _tab1Ribbon.removeClass('bg-light');
                _tab1Ribbon.addClass('bg-danger');

                _tab2Coordinates.clear();
                rows.each(function (d, j) {
                  _tab2Coordinates.add([d['x'], d['y']]);
                });

                onClickSearch(_tab2Coordinates);
              });

              $(reset).on('click', function (e) {
                e.preventDefault();
                $(rowFilter).find('.datatable-input').each(function (i) {
                  $(this).val('');
                  _tab1Table.column($(this).data('col-index')).search('', false, false);
                });
                _tab1Table.table().draw();

                _tab1Ribbon.find('strong').html('0');
                _tab1Ribbon.removeClass('bg-danger');
                _tab1Ribbon.addClass('bg-light');

                _tab2Coordinates.clear();

                onClickSearch(null);
              });
              break;
          }

          if (column.title() !== '기능' && column.title() !== 'x' && column.title() !== 'y') {
            $(input).appendTo($('<th>').appendTo(rowFilter));
          }
        });

        // hide search column for responsive table
        var hideSearchColumnResponsive = function () {
          thisTable.api().columns().every(function () {
            var column = this;
            if (column.responsiveHidden()) {
              $(rowFilter).find('th').eq(column.index()).show();
            } else {
              $(rowFilter).find('th').eq(column.index()).hide();
            }
          });
        };

        // init on datatable load
        hideSearchColumnResponsive();
        // recheck on window resize
        window.onresize = hideSearchColumnResponsive;
      },
      columnDefs: [
        {
          targets: [12, 13],
          orderable: false,
          visible: false,
          searchable: false,
        },
        //         {
        //           targets: 13,
        //           orderable: false,
        //           render: function (data, type, full, meta) {
        //             return `<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-hover-light-success">
        //   <i class="la la-check"></i></a>
        // <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-hover-light-danger ml-1">
        //   <i class="la la-remove"></i></a><script>
        // </script>`;
        //           },
        //         },
      ],

      autoWidth: true,
      select: 'single',
      order: [[0, 'desc']],
      buttons: [
        $.extend(true, {}, _tab1TableButtonOpts, {
          extend: 'print',
          exportOptions: {
            columns: [
              function (idx, data, node) {
                return idx > 0 && idx < 9;
              },
            ],
          },
        }),
        $.extend(true, {}, _tab1TableButtonOpts, {
          extend: 'excelHtml5',
          exportOptions: {
            columns: [
              function (idx, data, node) {
                return idx > 0 && idx < 10;
              },
            ],
          },
        }),
      ],
    });
  };

  const _initTab1Button = function () {
    $('#export_print').on('click', function (e) {
      e.preventDefault();
      _tab1Table.button(0).trigger();
    });

    $('#export_excel').on('click', function (e) {
      e.preventDefault();
      _tab1Table.button(1).trigger();
    });
  };

  function _onSelectTable(e, dt, type, indexes) {
    if (type === 'row') {
      _tab1Card.expand();
      let data = _tab1Table.rows(indexes).data();
      let pointArray = [data.pluck('x')[0], data.pluck('y')[0]];
      setMapMarker(pointArray);
    }
  }

  const _onTab1Shown = function () {
    setTimeout(function () {
      onTab1MapShown(_tab2Coordinates);
    }, 100);
  };

  const _onTab2Show = function () {
    if (_tab2Coordinates.size < 1) {
      $.notify({
        message: '지도에 표시할 검색결과가 없습니다',
      }, {
        type: 'danger',
        onClose: function () {
          $(_tab1).tab('show');
        },
      });
    }
  };

  const _onTab2Shown = function () {
    setTimeout(function () {
      onTab2MapShown(_tab2Coordinates);
    }, 100);
  };

  return {

    //main function to initiate the module
    init: function () {
      _tab1Card = new KTCard('kt_card_1');
      _tab1Ribbon = $('.ribbon-target');
      _tab1 = $('a[href="#kt_tab_pane_4_1"]');
      _tab2 = $('a[href="#kt_tab_pane_4_2"]');
      _tab2Coordinates = new Set();

      _init();

      _initTab1();
      _initTab1Button();

      _tab1Table.on('select', _onSelectTable);
      _tab1.on('shown.bs.tab', _onTab1Shown);
      _tab2.on('show.bs.tab', _onTab2Show);
      _tab2.on('shown.bs.tab', _onTab2Shown);
      _tab1Card.collapse();
    },

  };

}();

jQuery(document).ready(function () {
  if (document.getElementById('card_search')) ServiceSearch.init();
});
