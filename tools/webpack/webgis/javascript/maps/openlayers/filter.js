const layerSelectFilter = new Set([
  'city_planning_road',
  'geo_line_as',
  'n3a_a0010000',
  'n3a_b0010000',
  'n3p_f0020000',
  'swl_hmpipe_ls',
  'viw_bml_badm_as',
  'viw_bml_hadm_as',
  'viw_swl_pipe_as',
  'viw_wtl_cap_ps',
  'viw_wtl_pipe_dir_ps',
  'viw_wtl_prme_ps',
  'viw_wtl_taper_ps',
  'viw_wtl_userlabel_as',
  'viw_wtl_userlabel_ps',
  'viw_wtl_wspipe_ls',
]);

const featureNameFilter = new Set([
  'id',
  'geom',
  'geometry',
  '시설물구분',
  '레이어',
  'layer',
  '방향각',
  '회전방향',
  'EDDATE',
]);

const featureDateFilter = new Set([
  '설치일자',
  '유지보수일자',
  '준공일자',
  '폐관일자',
  '폐전일자',
  '허가일자',
]);

const styleRotationFilter = new Set([
  'viw_wtl_cap_ps',
  'viw_wtl_prme_ps',
  'viw_wtl_taper_ps',
  'viw_wtl_pipe_dir_ps',
  '가정내오수관',
  '가정오수받이',
  '갑압변',
  '배기변',
  '상수맨홀',
  '스케일부스터',
  '역사이펀',
  '오수맨홀',
  '오수받이',
  '우수맨홀',
  '우수받이',
  '이토변',
  '제수변',
  '지수전',
  '집수맨홀',
  '차집맨홀',
  '토구',
  '펌프시설',
  '하수펌프장',
  '합류맨홀',
]);

const styleDirectionFilter = new Set([
  '오수관',
  '우수관',
  '차집관',
  '합류관',
]);

export {
  layerSelectFilter,
  featureNameFilter,
  featureDateFilter,
  styleRotationFilter,
  styleDirectionFilter,
};
