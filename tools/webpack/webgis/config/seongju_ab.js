const defaultOptions = require('./index').default;

window.KTLayoutSearch = window.KTLayoutSearchInline = require('../javascript/maps/components/search');

const globalOptions = Object.assign(defaultOptions, {
  workspace: 'seongju_a',
  workspaceLocale: '성주',
  role: 'wtl',
  center: {
    latitude: 35.919317,
    longitude: 128.2810479,
  },
  rect: '128.090069,35.788799,128.426253,36.052894',
  table: {
    filter: true,
    vector: [
      // 'viw_swl_pipe_lm',
      'viw_wtl_puri_as',
      'viw_wtl_userlabel_as',
      'viw_wtl_spcnt_as',
      'viw_wtl_taper_ps',
      'viw_wtl_cap_ps',
      'viw_wtl_pipe_close_lm',
      // 'viw_wtl_pipe_lm',
      'viw_wtl_pipe_lm_filter',
      'viw_wtl_pipe_dir_ps',
      'viw_wtl_sply_ls',
      // 'viw_wtl_scvst_ps',
      // 'viw_wtl_manh_ps',
      'viw_wtl_meta_ps',
      'viw_wtl_flow_ps',
      'viw_wtl_fire_ps',
      'viw_wtl_valv_ps',
      // 'viw_wtl_valv_pres_ps',
      'viw_wtl_valv_block_ps',
      'viw_wtl_serv_ps',
      'viw_wtl_pres_ps',
      // 'viw_wtt_wutl_ht_re',
      // 'city_planning_road',
      'viw_wtl_userlabel_ps',
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
    repair: 'viw_wtt_wutl_ht_re',
  },
  kakao: {
    rest: '2b80b94ece8eb5cace6ef21359edac62',
  },
});

window.webgis = globalOptions;
