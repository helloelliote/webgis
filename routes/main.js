export default {
  index(req, res, next) {
    res.render('index', {
      _csrfToken: req.csrfToken(),
      title: '홈 |', // TODO: Fill in user organisation name
    });
  },
};
