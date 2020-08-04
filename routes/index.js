'use strict';

import { default as main } from './main';
import { default as api } from './api';
import { default as passportRoute } from './passport';

export default function (app, passport) {
  app.get('/', main.index);
  app.post('/api', api.general);
  
  app.get('/auth/signin', passportRoute.index);
  app.post('/auth/signin', function (req, res, next) {
    return passportRoute.login(req, res, next, passport);
  });
}
