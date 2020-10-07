import postgresql from '../middlewares/postgresql';

export default {
  registerGet(req, res, next) {
    res.render('service-register', {
      _csrfToken: req.csrfToken(),
      title: '민원등록 |', // TODO: Fill in user organisation name
    });
  },
  
  registerPost(req, res, next) {

  },

  searchGet(req, res, next) {
    res.render('service-search', {
      _csrfToken: req.csrfToken(),
      title: '민원검색 |', // TODO: Fill in user organisation name
    });
  },
};
