import { default as main } from './main';
import { default as api } from './api';

export default function(app) {
  app.get('/', main.index);
  app.post('/api', api.postgresQuery);
}
