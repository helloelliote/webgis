/**
 * @param {String} html representing any number of sibling elements
 * @return {ChildNode}
 */
function htmlToElement(html) {
  let template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

const _itemEl = htmlToElement(`<option value=""></option>`);

const OPR_NAM = 'PRD_NAM';

function formatSchedule(response) {
  return new Promise(resolve => {
    let optionHTML = '<option value="" hidden></option>';
    response.forEach(result => {
      const itemEl = _itemEl.cloneNode(true);
      itemEl.value = result[OPR_NAM];
      itemEl.innerHTML = result[OPR_NAM];
      optionHTML = optionHTML + itemEl.outerHTML;
    });
    resolve(optionHTML);
  });
}

// Webpack support
if (typeof module !== 'undefined') {
  module.exports = { formatSchedule };
}
