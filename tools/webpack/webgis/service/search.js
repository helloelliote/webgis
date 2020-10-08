/**
 * Original script: .demo5/src/js/pages/crud/datatables/search-options/advanced-search.js
 */

const KTDatatablesSearchOptionsAdvancedSearch = function () {

  let isPending = false;
  // Form elements
  let _card;
  let _form;
  let _submit;
  let _overlay;

  const init = function () {
    $.fn.dataTable.Api.register('column().title()', function () {
      return $(this.header()).text().trim();
    });
  };

  const initTable1 = function () {
    // begin first table
    const table = $('#kt_datatable').DataTable({
      responsive: true,
      // Pagination settings
      dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
      // read more: https://datatables.net/examples/basic_init/dom.html

      lengthMenu: [5, 10, 25, 50],

      pageLength: 5,

      language: {
        'lengthMenu': '표시 _MENU_',
      },

      searchDelay: 250,
      processing: true,
      serverSide: true,
      ajax: {
        url: HOST_URL + '/api//datatables/demos/server.php',
        type: 'POST',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            'RecordID', 'OrderID', 'Country', 'ShipCity', 'CompanyAgent',
            'ShipDate', 'Status', 'Type', 'Actions',
          ],
        },
      },
      columns: [
        { data: 'RecordID' },
        { data: 'OrderID' },
        { data: 'Country' },
        { data: 'ShipCity' },
        { data: 'CompanyAgent' },
        { data: 'ShipDate' },
        { data: 'Status' },
        { data: 'Type' },
        { data: 'Actions', responsivePriority: -1 },
      ],

      initComplete: function () {
        this.api().columns().every(function () {
          let column = this;
          let status;

          switch (column.title()) {
            case 'Country':
              column.data().unique().sort().each(function (d, j) {
                $('.datatable-input[data-col-index="2"]').append('<option value="' + d + '">' + d + '</option>');
              });
              break;

            case 'Status':
              status = {
                1: { 'title': 'Pending', 'class': 'label-light-primary' },
                2: { 'title': 'Delivered', 'class': ' label-light-danger' },
                3: { 'title': 'Canceled', 'class': ' label-light-primary' },
                4: { 'title': 'Success', 'class': ' label-light-success' },
                5: { 'title': 'Info', 'class': ' label-light-info' },
                6: { 'title': 'Danger', 'class': ' label-light-danger' },
                7: { 'title': 'Warning', 'class': ' label-light-warning' },
              };
              column.data().unique().sort().each(function (d, j) {
                $('.datatable-input[data-col-index="6"]').append('<option value="' + d + '">' + status[d].title + '</option>');
              });
              break;

            case 'Type':
              status = {
                1: { 'title': 'Online', 'state': 'danger' },
                2: { 'title': 'Retail', 'state': 'primary' },
                3: { 'title': 'Direct', 'state': 'success' },
              };
              column.data().unique().sort().each(function (d, j) {
                $('.datatable-input[data-col-index="7"]').append('<option value="' + d + '">' + status[d].title + '</option>');
              });
              break;
          }
        });
      },

      columnDefs: [
        {
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return `<div class="dropdown dropdown-inline">
  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown">
    <i class="la la-cog"></i>
  </a>
  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
    <ul class="nav nav-hoverable flex-column">
      <li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-edit"></i><span class="nav-text">Edit Details</span></a>
      </li>
      <li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-leaf"></i><span class="nav-text">Update Status</span></a>
      </li>
      <li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-print"></i><span
          class="nav-text">Print</span></a></li>
    </ul>
  </div>
</div>
<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Edit details">
  <i class="la la-edit"></i>
</a>
<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">
  <i class="la la-trash"></i>
</a>`;
          },
        },
        {
          targets: 6,
          render: function (data, type, full, meta) {
            let status = {
              1: { 'title': 'Pending', 'class': 'label-light-primary' },
              2: { 'title': 'Delivered', 'class': ' label-light-danger' },
              3: { 'title': 'Canceled', 'class': ' label-light-primary' },
              4: { 'title': 'Success', 'class': ' label-light-success' },
              5: { 'title': 'Info', 'class': ' label-light-info' },
              6: { 'title': 'Danger', 'class': ' label-light-danger' },
              7: { 'title': 'Warning', 'class': ' label-light-warning' },
            };
            if (typeof status[data] === 'undefined') {
              return data;
            }
            return '<span class="label label-lg font-weight-bold' + status[data].class + ' label-inline">' + status[data].title + '</span>';
          },
        },
        {
          targets: 7,
          render: function (data, type, full, meta) {
            let status = {
              1: { 'title': 'Online', 'state': 'danger' },
              2: { 'title': 'Retail', 'state': 'primary' },
              3: { 'title': 'Direct', 'state': 'success' },
            };
            if (typeof status[data] === 'undefined') {
              return data;
            }
            return '<span class="label label-' + status[data].state + ' label-dot mr-2"></span>' +
              '<span class="font-weight-bold text-' + status[data].state + '">' + status[data].title + '</span>';
          },
        },
      ],
    });

    const filter = function () {
      let val = $.fn.dataTable.util.escapeRegex($(this).val());
      table.column($(this).data('col-index')).search(val ? val : '', false, false).draw();
    };

    const asdasd = function (value, index) {
      let val = $.fn.dataTable.util.escapeRegex(value);
      table.column(index).search(val ? val : '', false, true);
    };

    $('#kt_search').on('click', function (e) {
      e.preventDefault();
      let params = {};
      $('.datatable-input').each(function () {
        let i = $(this).data('col-index');
        if (params[i]) {
          params[i] += '|' + $(this).val();
        } else {
          params[i] = $(this).val();
        }
      });
      $.each(params, function (i, val) {
        // apply search params to datatable
        table.column(i).search(val ? val : '', false, false);
      });
      table.table().draw();
    });

    $('#kt_reset').on('click', function (e) {
      e.preventDefault();
      $('.datatable-input').each(function () {
        $(this).val('');
        table.column($(this).data('col-index')).search('', false, false);
      });
      table.table().draw();
    });

    $('#kt_datepicker').datepicker({
      /**
       * @link https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#language
       * */
      language: 'ko',
      orientation: 'bottom',
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
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

  return {

    //main function to initiate the module
    init: function () {
      _card = $('#card_search');
      _form = _card.find('form');
      _submit = _form.find('button[type="submit"]');
      _overlay = _card.find('.overlay-layer');

      init();
      initTable1();
    },

  };

}();

jQuery(document).ready(function () {
  if (document.getElementById('card_search')) KTDatatablesSearchOptionsAdvancedSearch.init();
});
