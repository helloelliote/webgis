'use strict';

export default {
  index(req, res, next) {
    res.render('index', {
      _csrfToken: req.csrfToken(),
      title: 'Express',
    });
  },
};
