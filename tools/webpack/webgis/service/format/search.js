// Template HTML element (as jquery object)
const _resultEl = $(`<div class="quick-search-result"></div>`);
const _sectionEl = $(`<div class="font-size-lg text-primary font-weight-bolder text-uppercase mb-2"></div>`);
const _itemWrapperEl = $(`<div class="mb-4"></div>`);
const _itemEl = $(`<div class="d-flex align-items-center flex-grow-1">
  <div class="d-flex flex-column ml-3 mt-2 mb-2">
    <a href="javascript:;" class="font-weight-bold text-dark text-hover-primary"></a>
    <p hidden></p>
    <span class="font-size-sm font-weight-bold text-muted"></span>
  </div>
</div>`);

const ROWS = 'rows';
const CNAME = 'cname';
const COORDINATE = 'coordinate';
const FAC_NAM = 'fac_nam';
const HJD_NAM = 'hjd_nam';
const BJD_NAM = 'bjd_nam';

function formatFacilitySearch(response) {
  return new Promise(function (resolve) {
    // Use #clone() to create a new element from the template.
    const resultEl = _resultEl.clone();
    const results = response[ROWS];
    // Create an array of unique 'cname' values. Each entry will make a separate section element.
    const categorySet = [...new Set(results.map(result => result[CNAME]))];
    // For each 'cname' category section, read and write each item inside a wrapper element.
    categorySet.forEach(function (category) {
      const itemWrapperEl = _itemWrapperEl.clone();
      // Create an array of items that have the target 'cname' value.
      const items = results.filter(result => result[CNAME] === category);
      items.forEach(item => {
        const itemEl = _itemEl.clone();
        let fac_nam = item[FAC_NAM] == null || item[FAC_NAM] === '' ? '이름 없음' : item[FAC_NAM];
        let hjd_nam = item[HJD_NAM] == null ? '' : item[HJD_NAM];
        let bjd_nam = item[BJD_NAM] == null ? '' : item[BJD_NAM];
        if (hjd_nam === bjd_nam) bjd_nam = '';
        itemEl.find('a:first').html(fac_nam).addClass('quick-search-result-facility');
        itemEl.find('p:first').html(item[COORDINATE]);
        itemEl.find('span:first').html(hjd_nam + ' ' + bjd_nam);
        itemWrapperEl.append(itemEl);
      });
      // Write the unique 'cname' value as section.
      const sectionEl = _sectionEl.clone().html(category);
      sectionEl.append(itemWrapperEl);
      // Append each 'cname' section to .quick-search-result element.
      resultEl.append(sectionEl);
    });
    // return the formatted html element as String.
    resolve(resultEl.prop('outerHTML'));
  });
}

const DOCUMENTS = 'documents';
const PLACE = 'place_name';
const ADDR = 'address_name'; // TODO: 'road_address_name' & 'address_name'
const ROAD_ADDR = 'road_address_name';
const COORDS_X = 'x';
const COORDS_Y = 'y';

function formatAddressSearch(response) {
  return new Promise(function (resolve) {
    const resultEl = _resultEl.clone();
    const results = response[DOCUMENTS];
    const itemWrapperEl = _itemWrapperEl.clone();
    results.forEach(item => {
      const itemEl = _itemEl.clone();
      itemEl.find('a:first').html(item[PLACE]).addClass('quick-search-result-address');
      itemEl.find('p:first').html(item[COORDS_X] + ',' + item[COORDS_Y]);
      itemEl.find('span:first').html(item[ROAD_ADDR]);
      itemWrapperEl.append(itemEl);
    });
    const sectionEl = _sectionEl.clone().html('장소 및 주소');
    sectionEl.append(itemWrapperEl);
    resultEl.append(sectionEl);
    resolve(resultEl.prop('outerHTML'));
  });
}

// Webpack support
if (typeof module !== 'undefined') {
  module.exports = { formatFacilitySearch, formatAddressSearch };
}

// {
// 			"address_name": "경북 경주시 동천동 800",
// 			"category_group_code": "PK6",
// 			"category_group_name": "주차장",
// 			"category_name": "교통,수송 > 교통시설 > 주차장",
// 			"distance": "",
// 			"id": "10173817",
// 			"phone": "",
// 			"place_name": "경주시청 주차장",
// 			"place_url": "http://place.map.kakao.com/10173817",
// 			"road_address_name": "경북 경주시 양정로 260",
// 			"x": "129.224777170613",
// 			"y": "35.8557391911591"
// 		},