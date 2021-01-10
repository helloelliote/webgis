export default {
  index(req, res, next) {
    res.render('index', {
      _csrfToken: req.csrfToken(),
      title: '홈 |', // TODO: Fill in user organisation name
      KAKAO_API_KEY: process.env.KAKAO_API_KEY,
    });
  },
};
