const defaultOptions = require('./index').default;

window.KTLayoutSearch = window.KTLayoutSearchInline = require('../javascript/maps/components/search');

const globalOptions = Object.assign(defaultOptions, {
  workspace: 'yeongju_a',
  workspaceLocale: '영주',
  role: 'wtl',
  center: {
    latitude: 36.805679,
    longitude: 128.624043,
  },
  rect: '128.372325,36.686060,128.787714,37.073914',
  table: {
    filter: true,
    spi: [
      'viw_spi_ps',
    ],
    vector: [
      'viw_wtl_puri_as',
      // 'viw_wtl_taper_ps',
      'viw_wtl_cap_ps',
      'viw_wtl_pipe_close_lm',
      'viw_wtl_pipe_lm',
      'viw_wtl_pipe_lm_filter',
      'viw_wtl_pipe_dir_ps',
      'viw_wtl_sply_ls',
      // 'viw_wtl_scvst_ps',
      // 'viw_wtl_manh_ps',
      'viw_wtl_meta_ps',
      'viw_wtl_flow_ps',
      'viw_wtl_fire_ps',
      'viw_wtl_valv_ps',
      'viw_wtl_valv_pres_ps',
      'viw_wtl_valv_block_ps',
      'viw_wtl_serv_ps',
      'viw_wtl_pres_ps',
      'viw_wtt_wutl_ht',
      'viw_wtl_userlabel_ps',
      'viw_wtl_prme_ps',
    ],
    image: [
      // 'n3a_a0010000',
      // 'n3a_b0010000',
      'lake',
      'road',
      'buld_mah',
    ],
    maintenance: 'viw_web_wutl_ht_img',
    photo: 'viw_wtt_st_image',
    repairPhoto: 'viw_swt_subimge_et',
    repair: 'viw_wtt_wutl_ht',
  },
  kakao: {
    rest: '6f9d4d0e21c06821096587024beeb8a7',
  },
});

window.webgis = globalOptions;
