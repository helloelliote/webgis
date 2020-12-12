/* eslint-disable no-undef */
'use strict';

import { setMapMarker, setMapMarkerSet } from './kakaoMap';

const ServiceSearch = function () {

  let _tableEl;
  let _table;
  let _tableButtonOptions;
  let _tableControl;
  let _tableSearchButton;
  let _tableSearchButtonLabel;
  let _tableSearchResetButton;
  let _searchResultSet;
  let _tableRefreshButton;
  let _hasSearch = false;

  let _map;
  let _mapWrapper;
  let _mapToggle;
  let _isMapExpand = false;

  let _containerHeight;
  let _mapHeight;
  let _theadHeight;

  $.fn.dataTable.Api.register('column().title()', function () {
    return $(this.header()).text().trim();
  });

  const _init = function () {
    moment.locale('ko');

    _tableButtonOptions = {
      pageSize: 'A4',
      orientation: 'landscape',
      filename: moment().format('YYYYMMDD') + '_민원',
      messageTop: moment().format('llll'),
      title: '',
    };

    _containerHeight = document.querySelector('#container-search').offsetHeight;
    _mapHeight = document.querySelector('#search_map').offsetHeight;
    _theadHeight = document.querySelector('#kt_datatable thead').offsetHeight + 55;
  };

  const _initTable = function () {

    // begin first tab
    _table = _tableEl.DataTable({
      ajax: {
        url: `${window.location.origin}/service/search`,
        type: 'POST',
        headers: {
          'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
        },
      },
      autoWidth: true,
      buttons: [
        $.extend(true, {}, _tableButtonOptions, {
          extend: 'print',
          exportOptions: {
            columns: [
              function (idx, data, node) {
                return idx > 1 && idx < 11;
              },
            ],
          },
        }),
        $.extend(true, {}, _tableButtonOptions, {
          extend: 'excelHtml5',
          exportOptions: {
            columns: [
              function (idx, data, node) {
                return idx > 1 && idx < 13;
              },
            ],
          },
        }),
      ],
      columnDefs: [
        {
          targets: -1,
          orderable: false,
          className: 'dtr-control',
          width: 1,
        },
        {
          targets: [0, 1],
          orderable: false,
          visible: false,
          searchable: false,
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            let dataString = data.toString();
            return `${dataString.substring(0, 4)}–${dataString.substring(4)}`;
          },
        },
      ],
      columns: [
        { data: 'x' },
        { data: 'y' },
        { data: '번호' },
        { data: '접수자' },
        { data: '일자' },
        { data: '민원인' },
        { data: '연락처' },
        { data: '지번 주소' },
        { data: '도로명 주소' },
        { data: '접수' },
        { data: '진행' },
        { data: '대행' },
        { data: '상세' },
        { data: 'Button1' },
      ],
      deferRender: true,
      // read more: https://datatables.net/examples/basic_init/dom.html
      dom: `<'row'<tr>><'row'<'col-sm-12 col-md-3'ri><'col-sm-12 col-md-9 dataTables_pager'lp>>`,
      initComplete: function () {
        let thisTable = this;
        let rowFilter = $('<tr class="filter"></tr>').appendTo($(_table.table().header()));

        this.api().columns().every(function () {
          let column = this;
          let input;

          switch (column.title()) {
            case '번호':
            case '접수자':
            case '민원인':
            case '연락처':
            case '지번 주소':
            case '도로명 주소': {
              input = $(`<input type="text" class="form-control form-control-sm form-filter datatable-input" data-col-index="${column.index()}"/>`);
              break;
            }

            case '일자': {
              input = $(`<div class='input-group' id='kt_datatable_daterange'>
  <input type='text' class="form-control form-control-sm form-filter datatable-input" readonly="readonly"
         data-col-index="${column.index()}"/></div>`);
              break;
            }

            case '접수내용': {
              // noinspection NonAsciiCharacters
              let type = {
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
              input = $(`<select class="form-control form-filter datatable-input selectpicker" title="선택" data-col-index="${column.index()}" multiple data-selected-text-format="count > 1" data-width="fit"></select>`);
              column.data().unique().sort().each(function (d, j) {
                $(input).append('<option value="' + d + '">' + type[d].title + '</option>');
              });
              break;
            }

            case '진행상태': {
              // noinspection NonAsciiCharacters
              let status = {
                '미분류': { title: '미분류', state: 'label-light-primary' },
                '신청접수': { title: '신청접수', state: ' label-light-success' },
                '진행중': { title: '진행중', state: ' label-light-warning' },
                '처리보류': { title: '처리보류', state: ' label-light-danger' },
                '협조/이첩': { title: '협조/이첩', state: ' label-light-danger' },
                '처리완료': { title: '처리완료', state: ' label-light-danger' },
                '처리중단': { title: '처리중단', state: ' label-light-danger' },
              };
              input = $(`<select class="form-control form-filter datatable-input selectpicker" title="선택" data-col-index="${column.index()}" multiple data-max-options="1" data-width="fit"></select>`);
              column.data().unique().sort().each(function (d, j) {
                $(input).append('<option value="' + d + '">' + status[d].title + '</option>');
              });
              break;
            }

            default: {
              break;
            }
          }

          if (column.title() !== 'x' && column.title() !== 'y' && column.title() !== '민원상세') {
            $(input).appendTo($('<th>').appendTo(rowFilter));
          }
        });

        const setSearchColumnDateRangePicker = function () {
          // predefined ranges
          let start = moment().subtract(29, 'days');
          let end = moment();

          // noinspection NonAsciiCharacters
          const options = {
            // autoApply: true,
            autoUpdateInput: true,
            drops: 'up',
            buttonClasses: ' btn',
            applyClass: 'btn-success',
            cancelClass: 'btn-secondary',
            startDate: start,
            endDate: end,
            ranges: {
              '오늘': [moment(), moment()],
              '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              '지난 7 일': [moment().subtract(6, 'days'), moment()],
              '지난 30 일': [moment().subtract(29, 'days'), moment()],
              '이전 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              '이번 달': [moment().startOf('month'), moment().endOf('month')],
            },
            locale: {
              applyLabel: '적용',
              cancelLabel: '취소',
              customRangeLabel: '직접 선택...',
            },
          };

          $('#kt_datatable_daterange').daterangepicker(options, function (start, end, label) {
            $('#kt_datatable_daterange .datatable-input').val(start.format('YY.MM.DD') + ' ~ ' + end.format('YY.MM.DD'));
          });
        };

        // init on datatable load
        setSearchColumnDateRangePicker();

        // hide search column for responsive table
        const hideSearchColumnResponsive = function () {
          thisTable.api().columns().every(function () {
            var column = this;
            if (column.responsiveHidden()) {
              $(rowFilter).find('th').eq(column.index()).show();
            } else {
              $(rowFilter).find('th').eq(column.index()).hide();
            }
          });
          thisTable.api().table().draw();
        };

        // init on datatable load
        hideSearchColumnResponsive();
        // recheck on window resize
        window.onresize = hideSearchColumnResponsive;
      },
      language: {
        url: '/assets/media/json/datatables-net-i18n.json',
        select: {
          processing: '불러오는 중...',
          rows: {
            0: '표를 클릭하여 선택하세요',
            _: '%d 건의 민원이 선택되었습니다',
          },
        },
      },
      lengthMenu: [5, 10, 25, 50],
      order: [[2, 'desc']],
      pageLength: 10,
      pagingType: 'full_numbers',
      processing: true,
      responsive: {
        details: {
          target: -1,
          type: 'column',
        },
      },
      select: {
        className: 'row-selected',
        style: 'os',
        items: 'row',
      },
      serverSide: false,
    });
  };

  function _initTableContextMenu() {
    _tableEl.contextMenu({
      selector: 'tbody > tr[role="row"]',
      build: ($trigger, e) => {
        let selected = _table.rows({ selected: true });
        let isSelected = selected.count() > 0;
        return {
          callback: (key, options) => {
          },
          items: {
            'title': {
              name: () => {
                switch (selected.count()) {
                  case 0: {
                    return '선택: <strong>없음</strong>';
                  }
                  case 1: {
                    const dataString = selected.data().pluck('번호')[0].toString();
                    return `선택: <strong>${dataString.substring(0, 4)}–${dataString.substring(4)}</strong>`;
                  }
                  default: {
                    return '선택: <strong>1 건 이상</strong>';
                  }
                }
              },
              isHtmlName: true,
              icon: 'fas fa-mouse-pointer text-primary',
              callback: () => false,
            },
            'sep1': '---------',
            'status': {
              name: '처리완료',
              icon: 'fas fa-check text-success',
              disabled: !isSelected,
              callback: (itemKey, opt, e) => {

              },
            },
            'edit': {
              name: '편집',
              isHtmlName: true,
              icon: 'fas fa-pen-alt text-warning',
              disabled: selected.count() !== 1,
              callback: (itemKey, opt, e) => {
                // return _table.ajax.reload();
              },
            },
            'delete': {
              name: `<span style="color: red">삭제</span>`,
              icon: 'fas fa-trash text-danger',
              isHtmlName: true,
              disabled: !isSelected,
              callback: (itemKey, opt, e) => {

              },
            },
            'sep2': '---------',
            'export': {
              name: () => {
                if (isSelected) {
                  return '내보내기 (선택)';
                } else {
                  return _hasSearch ? '내보내기 (검색)' : '내보내기 (전체)';
                }
              },
              icon: 'fas fa-share text-info',
              items: {
                'print': {
                  name: '인쇄',
                  icon: 'fas fa-print',
                  callback: () => _table.button(0).trigger(),
                },
                'excelHtml5': {
                  name: 'Excel',
                  icon: 'far fa-file-excel text-success',
                  callback: () => _table.button(1).trigger(),
                },
              },
            },
          },
        };
      },
    });
  }

  function _onSelectTable(e, dt, type, indexes) {
    if (type === 'row') {
      let data = _table.rows(indexes).data();
      let pointArray = [data.pluck('x')[0], data.pluck('y')[0]];
      setMapMarker(pointArray);
    }
  }

  function _onClickMapToggle(event) {
    event.preventDefault();
    _isMapExpand = !_isMapExpand;
    if (_isMapExpand) {
      _tableEl.find('.datatable-input').removeAttr('readonly').prop('disabled', true);
      _map.height(_containerHeight - _theadHeight);
      _mapWrapper.height(_containerHeight - _theadHeight);
    } else {
      _tableEl.find('.datatable-input').prop('disabled', false);
      _mapWrapper.height(_mapHeight);
      _map.height(_mapHeight);
    }
  }

  function _onTransitionStart(event) {
    event.preventDefault();
    _tableSearchResetButton.addClass('disabled');
  }

  function _onTransitionEnd(event) {
    event.preventDefault();
    setTimeout(() => {
      if (_searchResultSet.size > 0) {
        setMapMarkerSet(_searchResultSet);
      }
      _tableSearchResetButton.removeClass('disabled');
    }, 250);
  }

  function _onClickTableSearch(event) {
    event.preventDefault();

    _table.rows().deselect();

    let params = {};
    _tableEl.find('.datatable-input').each(function () {
      let i = $(this).data('col-index');
      if (params[i]) {
        params[i] += '|' + $(this).val();
      } else {
        params[i] = $(this).val();
      }
    });
    $.each(params, (i, val) => {
      _table.column(i).search(val ? val : '', false, false);
    });
    _table.table().draw();

    let filterRows = _table.rows({ search: 'applied' }).data();

    _updateSearchLabel(filterRows.length);

    if (filterRows.length < 1) {
      _hasSearch = false;
      $.notify({
        message: '지도에 표시할 검색결과가 없습니다',
      }, { type: 'danger' });
      _searchResultSet.clear();
      setMapMarkerSet(null);
    } else {
      _hasSearch = true;
      _searchResultSet.clear();
      filterRows.each((d, j) => _searchResultSet.add([d['x'], d['y']]));
      setTimeout(() => setMapMarkerSet(_searchResultSet), 250);
    }
  }

  function _onClickTableSearchReset(event) {
    event.preventDefault();

    _table.rows().deselect();

    let input = _tableEl.find('.datatable-input');
    input.each(function () {
      $(this).val('');
      _table.column($(this).data('col-index')).search('', false, false);
    });
    _table.table().draw();

    input.prop('disabled', false);
    _map.height(_mapHeight);
    _mapWrapper.height(_mapHeight);

    _updateSearchLabel(0);

    _hasSearch = false;
    _searchResultSet.clear();
    setMapMarkerSet(null);
  }

  function _updateSearchLabel(count) {
    if (count > 0) {
      _tableSearchButtonLabel.removeAttr('hidden').html(`${count} 건`);
    } else {
      _tableSearchButtonLabel.attr('hidden', true).html('');
    }
  }

  function _onClickTableRefresh(event) {
    event.preventDefault();
    _table.ajax.reload();
  }

  function _onErrorDt(e, settings, techNote, message) {
    console.warn(`[오류] ${message}`);
  }

  return {

    //main function to initiate the module
    init: function () {
      _searchResultSet = new Set();

      _tableEl = $('#kt_datatable');
      _tableControl = $('.ribbon-target');
      _tableSearchButton = _tableControl.find('#kt_datatable_search');
      _tableSearchButtonLabel = _tableSearchButton.find('.label');
      _tableSearchResetButton = _tableControl.find('#kt_datatable_clear');
      _tableRefreshButton = _tableControl.find('#kt_datatable_refresh');
      _mapToggle = _tableControl.find('#kt_datatable_map');
      _mapWrapper = $('#search_map_wrapper');
      _map = _mapWrapper.find('#search_map');

      _init();
      _initTable();
      _initTableContextMenu();

      _table.on('select', _onSelectTable);
      _tableSearchButton.on('mousedown', _onClickTableSearch);
      _tableSearchResetButton.on('mousedown', _onClickTableSearchReset);
      _tableRefreshButton.on('mousedown', _onClickTableRefresh);
      _mapToggle.on('mousedown', _onClickMapToggle);
      _map.on('transitionstart', _onTransitionStart);
      _map.on('transitionend', _onTransitionEnd);
      _map.bind('mousewheel', () => false);

      _table.on('error.dt', _onErrorDt);
    },
  };

}();

jQuery(document).ready(function () {
  if (document.getElementById('card_search')) ServiceSearch.init();
});
