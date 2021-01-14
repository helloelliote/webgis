/* eslint-disable no-undef */
import { and, during } from 'ol/format/filter';
import { geoJson, wfs } from '../format';
import { property } from '../layer';

/**
 * @link https://openlayers.org/en/latest/apidoc/module-ol_format_filter.html
 */
const FeatureFilter = function () {

  let _vectorLayer;
  let _requestUrl;
  let _requestDefaults;
  let _form;
  let _featureTypeMap = new Map();

  function _init() {
    _requestUrl = `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/wfs`;
    _requestDefaults = {
      featurePrefix: window.webgis.workspace,
      outputFormat: 'application/json',
      srsName: 'EPSG:5187',
    };
  }

  /**
   * Common filter functions
   */

  function _addFeatureType(index, name) {
    _featureTypeMap.set(index, { name: name, filters: [] });
  }

  function _removeFeatureType(index) {
    if (_featureTypeMap.has(index)) {
      const featureTypeName = _featureTypeMap.get(index)['name'];
      _vectorLayer.getLayer(`${featureTypeName}_filter`).getSource().clear();
      _featureTypeMap.delete(index);
    }
  }

  function _addFilter(index, filter) {
    _featureTypeMap.get(index)['filters'].push(filter);
  }

  function _removeFilter(index, filterIndex) {
    _featureTypeMap.get(index)['filters'].splice(filterIndex, 1);
  }

  function _joinFilters(filters) {
    return filters.length > 1 ? and(...filters) : filters[0];
  }

  function _executeSearch() {
    const requests = _getRequestMap();
    const requestSerializer = new XMLSerializer();

    requests.forEach((request, featureTypeName) => {
      fetch(_requestUrl, _getRequestInit(request, requestSerializer)).then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      }).then(result => {
        _vectorLayer.hideLayers([featureTypeName, 'viw_wtl_cap_ps']);
        _vectorLayer.getLayer(`${featureTypeName}_filter`).getSource().addFeatures(geoJson.readFeatures(result));
      }).catch(error => {
        $.notify({ message: `검색정보를 불러오지 못하였습니다<br>(${error})` },
          { type: 'danger' },
        );
      });
    });
  }

  function _getRequestMap() {
    const requestMap = new Map();
    _featureTypeMap.forEach(featureType => {
      let request = wfs.writeGetFeature({
        ..._requestDefaults,
        featureTypes: [featureType['name']],
        filter: _joinFilters(featureType['filters']),
        propertyNames: property[featureType['name']].propertyName,
      });
      requestMap.set(featureType['name'], request);
    });
    return requestMap;
  }

  function _getRequestInit(request, xmlSerializer) {
    return {
      method: 'POST',
      body: xmlSerializer
        .serializeToString(request)
        .replace('/gml', '/gml/3.2'),
    };
  }

  /**
   * Filter 'VIW_WTL_PIPE_LM' by column '설치일자'
   */

  function _initPipeSearch() {
    const pipeFilterMenu = document.getElementById('viw_wtl_pipe_lm_filter');
    pipeFilterMenu.querySelectorAll('.navi-item').forEach(element => {
      element.addEventListener('click', _onClickPipeFilterMenu, false);
    });
    _form = pipeFilterMenu.querySelector('.form');
    _form.querySelectorAll('input').forEach(element => {
      $(element).inputmask({
        mask: '9999',
        placeholder: '', // remove underscores from the input mask
      });
    });
    _form.querySelector('button').addEventListener('click', _onClickPipeFilterButton, false);
  }

  function _onClickPipeFilterMenu(event) {
    event.preventDefault();
    const range = event.target.title;
    switch (range) {
      case '-1': {
        _resetPipeSearch();
        break;
      }
      default: {
        const begin = '1000-01-01';
        const end = moment().subtract(range, 'years').format('YYYY-MM-DD');
        _executePipeSearch(begin, end);
        break;
      }
    }
  }

  function _onClickPipeFilterButton(event) {
    event.preventDefault();
    let begin = _form.querySelector('input[name="begin"]').value;
    begin = begin.length === 0 ? '1000-01-01' : `${begin}-01-01`;
    let end = _form.querySelector('input[name="end"]').value;
    end = end.length === 0 ? moment().format('YYYY-MM-DD') : `${end}-12-31`;
    _executePipeSearch(begin, end);
  }

  function _executePipeSearch(begin, end) {
    _removeFeatureType(-1);
    _addFeatureType(-1, 'viw_wtl_pipe_lm');
    _addFilter(-1, during('설치일자', begin, end));
    _executeSearch();
  }

  function _resetPipeSearch() {
    _featureTypeMap.forEach((featureType, index) => {
      _vectorLayer.showLayers([featureType['name']]);
      _removeFeatureType(index);
    });
  }

  return {
    init: function (layer) {
      _vectorLayer = layer;

      _init();
      _initPipeSearch();
    },
  };

}();

export default FeatureFilter;
