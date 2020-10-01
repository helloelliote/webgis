'use strict';

const { formatSectionSearch } = require('./format/section');

const OLWaterSection = function () {
  // Private properties
  let _target;
  let _toggle;
  let _resultWrapper;
  let _resultWrapperGroup;
  let _resultDropdown;
  let _resultDropdownToggle;
  let _query = '';

  let _timeout = false;
  let _isProcessing = false;
  let _requestTimeout = 200;
  let _resultClass = 'quick-search-has-result';

  let _isActive = false;
  let _queryObject = {
    viw_wtl_wtsa_as: {
      parent: null,
      name: '급수구역명',
      child: 'viw_wtl_wtssa_as',
    },
    viw_wtl_wtssa_as: {
      parent: 'viw_wtl_wtsa_as',
      name: '급수분구명',
      child: 'viw_wtl_wtsba_as',
    },
    viw_wtl_wtsba_as: {
      parent: 'viw_wtl_wtssa_as',
      name: '급수블럭명',
      child: null,
    },
  };

  const _showDropdown = function () {
    if (_resultDropdownToggle && !KTUtil.hasClass(_resultDropdown, 'show')) {
      $(_resultDropdownToggle).dropdown('toggle');
      $(_resultDropdownToggle).dropdown('update');
    }
  };

  const _hideDropdown = function () {
    if (_resultDropdownToggle && KTUtil.hasClass(_resultDropdown, 'show')) {
      $(_resultDropdownToggle).dropdown('toggle');
    }
  };

  const _processSearch = function () {
    if (_hasResult && _query === _resultWrapper.id) {
      KTUtil.addClass(_resultWrapper, _resultClass);
      _showDropdown();
      KTUtil.scrollUpdate(_resultDropdown);

      return;
    }

    _query = _resultWrapper.id;

    KTUtil.removeClass(_resultWrapper, _resultClass);
    _hideDropdown();

    setTimeout(function () {
      $.ajax({
        url: `${window.location.origin}/api/wtl/section`,
        headers: {
          'CSRF-Token': $('meta[name=\'csrf-token\']').attr('content'),
        },
        data: {
          table: _query,
          column: _queryObject[_query]['name'],
        },
        dataType: 'json',
        success: function (res) {
          formatSectionSearch(res)
            .then(function (result) {
              KTUtil.addClass(_resultWrapper, _resultClass);
              KTUtil.setHTML(_resultDropdown, result);
              _showDropdown();
              KTUtil.scrollUpdate(_resultDropdown);
            });
        },
        error: function (res) {
          KTUtil.addClass(_target, _resultClass);
          KTUtil.setHTML(_resultDropdown, '<span class="font-weight-bold text-muted">Connection error. Please try again later..</div>');
          _showDropdown();
          KTUtil.scrollUpdate(_resultDropdown);
        },
      });
    }, 250);
  };

  const _handleSearch = function (event) {
    if (_isProcessing === true) {
      return;
    }

    if (_timeout) {
      clearTimeout(_timeout);
    }

    _resultWrapper = event.target.parentElement;
    _resultDropdown = KTUtil.find(_resultWrapper, '.dropdown-menu');
    _resultDropdownToggle = KTUtil.find(_resultWrapper, '[data-toggle="dropdown"]');

    _timeout = setTimeout(function () {
      _processSearch();
    }, _requestTimeout);
  };

  const _handleSearchToggle = function () {
    _isActive = !_isActive;
    if (_isActive) {
      _toggle.classList.add('active');
    } else {
      _toggle.classList.remove('active');
    }
  };

  // Public methods
  return {
    init: function (id) {
      _target = KTUtil.getById(id);

      if (!_target) {
        return;
      }

      _toggle = KTUtil.find(_target, '#section-toggle');
      _resultWrapperGroup = KTUtil.findAll(_target, '.topbar-item');

      KTUtil.addEvent(_toggle, 'click', _handleSearchToggle);
      _resultWrapperGroup.forEach(_wrapper => {
        KTUtil.addEvent(_wrapper, 'click', _handleSearch);
      });
    },
  };
};

// Webpack support
if (typeof module !== 'undefined') {
  module.exports = OLWaterSection;
}

const OlWaterSection = OLWaterSection;
