const defaultOptions = require('./index').default;

window.KTLayoutSearch = window.KTLayoutSearchInline = require('../javascript/maps/components/search');

const globalOptions = Object.assign(defaultOptions, {
  workspace: 'yeongcheon_b',
  role: '하수',
  center: {
    latitude: 35.9732633,
    longitude: 128.9386044,
  },
  rect: '128.663600,35.816669,129.182801,36.188639',
  table: {
    filter: false,
    vector: [
      'viw_swl_pipe_lm',
    ],
    image: [
      'n3a_a0010000',
      'n3a_b0010000',
    ],
    maintenance: 'viw_web_wutl_ht_img',
    photo: 'viw_wtt_st_image',
    repairPhoto: 'viw_wtt_subimge_et_re',
    repair: 'viw_wtt_wutl_ht_re',
  },
});

window.webgis = globalOptions;
