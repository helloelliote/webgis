export default {
  index(req, res, next) {
    res.render('index', {
      _csrfToken: req.csrfToken(),
      title: '홈 | 상수도 조회시스템', // TODO: Fill in user organisation name
      company_ko: process.env.COMPANY_KO,
      company_en: process.env.COMPANY_EN,
      role_ko: process.env.ROLE_KO,
      role_en: process.env.ROLE_EN,
      KAKAO_API_KEY: process.env.KAKAO_API_KEY,
    });
  },
};
