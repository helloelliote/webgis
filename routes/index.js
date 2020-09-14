import { default as main } from './main';
import { default as passportRoute } from './passport';
import { default as service } from './service';

export default function (router, passport) {
  router.get('/', main.index);

  router.get('/service/register', service.register);
  router.get('/service/search', service.search);

  router.get('/auth/signin', passportRoute.index);
  router.post('/auth/signin', function (req, res, next) {
    return passportRoute.login(req, res, next, passport);
  });
}
