import Ajax from './worker/Ajax';
import AjaxWorker from './worker/ajax.worker';

const ajax = new Ajax(new AjaxWorker());

ajax
  .fetch('test', { id: 9833 })
  .then(function (result) {
    console.log(result);
  });
