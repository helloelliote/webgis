import { default as main } from './main';
import { default as passportRoute } from './passport';
import { default as wtl } from './wtl';
// import { default as swl } from './swl';
import { default as service } from './service';

export default function (router, passport) {
  router.get('/', main.index);

  router.get('/auth/signin', passportRoute.index);
  router.post('/auth/signin', function (req, res, next) {
    return passportRoute.login(req, res, next, passport);
  });
  
  router.get('/api/wtl/search', wtl.search);
  router.get('/api/wtl/section', wtl.section);

  router.get('/service/register', service.registerGet);
  router.post('/service/register', service.registerPost);

  router.get('/service/search', service.searchGet);
}
