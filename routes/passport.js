'use strict';

export default {
  index(req, res, next) {
    res.render('signin', {
      _csrfToken: req.csrfToken(),
    });
  },
  
  login(req, res, next, passport) {
    passport.authenticate('local-signin', signInUser)(req, res, next);
    
    function signInUser(err, user, info) {
      req.login(user, function (err) {
        if (err) {
          return res.status(403).json({
            msg: 'forbid!',
          });
        } else {
          return res.json({
            name: 'volla',
          });
        }
      });
    }
  },
};

