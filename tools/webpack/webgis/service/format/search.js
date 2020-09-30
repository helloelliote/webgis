/**
 * @param {String} html representing any number of sibling elements
 * @return {ChildNode}
 */
function htmlToElement(html) {
  let template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

const _resultEl = htmlToElement(`<div class="quick-search-result"></div>`);
const _sectionEl = htmlToElement(`<div class="font-size-lg text-primary font-weight-bolder text-uppercase mb-2"></div>`);
const _itemWrapperEl = htmlToElement(`<div class="mb-4"></div>`);
const _itemEl = htmlToElement(`<div class="d-flex align-items-center flex-grow-1">
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
    const resultEl = _resultEl.cloneNode(true);
    const results = response[ROWS];
    // Create an array of unique 'cname' values. Each entry will make a separate section element.
    const categorySet = [...new Set(results.map(result => result[CNAME]))];
    // For each 'cname' category section, read and write each item inside a wrapper element.
    categorySet.forEach(function (category) {
      const itemWrapperEl = _itemWrapperEl.cloneNode(true);
      // Create an array of items that have the target 'cname' value.
      const items = results.filter(result => result[CNAME] === category);
      items.forEach(item => {
        const itemEl = _itemEl.cloneNode(true);
        let fac_nam = item[FAC_NAM] == null || item[FAC_NAM] === '' ? '이름 없음' : item[FAC_NAM];
        let hjd_nam = item[HJD_NAM] == null ? '' : item[HJD_NAM];
        let bjd_nam = item[BJD_NAM] == null ? '' : item[BJD_NAM];
        if (hjd_nam === bjd_nam) bjd_nam = '';
        itemEl.querySelector('a').classList.add('quick-search-result-facility');
        itemEl.querySelector('a').innerHTML = fac_nam;
        itemEl.querySelector('p').innerHTML = item[COORDINATE];
        itemEl.querySelector('span').innerHTML = hjd_nam + ' ' + bjd_nam;
        itemWrapperEl.appendChild(itemEl);
      });
      // Write the unique 'cname' value as section.
      const sectionEl = _sectionEl.cloneNode(true);
      sectionEl.append(category);
      sectionEl.appendChild(itemWrapperEl);
      // Append each 'cname' section to .quick-search-result element.
      resultEl.appendChild(sectionEl);
    });
    // return the formatted html element as String.
    resolve(resultEl.outerHTML);
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
    const resultEl = _resultEl.cloneNode(true);
    const results = response[DOCUMENTS];
    const itemWrapperEl = _itemWrapperEl.cloneNode(true);
    results.forEach(item => {
      const itemEl = _itemEl.cloneNode(true);
      itemEl.querySelector('a').classList.add('quick-search-result-address');
      itemEl.querySelector('a').innerHTML = item[PLACE];
      itemEl.querySelector('p').innerHTML = item[COORDS_X] + ',' + item[COORDS_Y];
      itemEl.querySelector('span').innerHTML = item[ROAD_ADDR];
      itemWrapperEl.appendChild(itemEl);
    });
    const sectionEl = _sectionEl.cloneNode(true);
    sectionEl.append('장소 및 주소');
    sectionEl.appendChild(itemWrapperEl);
    resultEl.appendChild(sectionEl);
    resolve(resultEl.outerHTML);
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
