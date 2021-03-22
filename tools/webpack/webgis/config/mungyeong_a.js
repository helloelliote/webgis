const defaultOptions = require('./index').default;

window.KTLayoutSearch = window.KTLayoutSearchInline = require('../javascript/maps/components/search');

const globalOptions = Object.assign(defaultOptions, {
  workspace: 'mungyeong_a',
  role: '상수',
  center: {
    latitude: 36.5868172,
    longitude: 128.1848969,
  },
  rect: '127.854500,36.500000,128.385000,36.874555',
  table: {
    filter: false,
    vector: [
      'viw_wtl_puri_as',
      'viw_wtl_userlabel_as',
      'viw_wtl_spcnt_as',
      'viw_wtl_taper_ps',
      'viw_wtl_cap_ps',
      'viw_wtl_pipe_lm',
      // 'viw_wtl_pipe_lm_filter',
      // 'viw_wtl_pipe_dir_ps',
      'viw_wtl_sply_ls',
      // 'viw_wtl_scvst_ps',
      // 'viw_wtl_manh_ps',
      'viw_wtl_meta_ps',
      'viw_wtl_flow_ps',
      'viw_wtl_fire_ps',
      'viw_wtl_valv_ps', // todo: 감압변이 들어가 있는지 확인
      // 'viw_wtl_valv_pres_ps',
      // 'viw_wtl_valv_block_ps',
      'viw_wtl_serv_ps',
      'viw_wtl_pres_ps',
      // 'viw_wtt_wutl_ht_re',
      'viw_wtl_userlabel_ps',
    ],
    image: [
      'n3a_a0010000',
      'n3a_b0010000',
    ],
    maintenance: 'viw_web_wutl_ht_img',
    photo: 'viw_wtt_st_image',
    repairPhoto: 'viw_wtt_subimge_et',
    repair: 'viw_wtt_wutl_ht_re',
  },
});

window.webgis = globalOptions;
