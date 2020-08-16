'use strict';

/**
 usage:
 const ajax = new Ajax(new AjaxWorker());
 ajax
 .fetch('tst', {
    id: 9833,
  })
 .then(function (result) {
    console.log(result);
  })
 .catch(function (error) {
    console.error(error);
  });
 */
export default class Ajax {

  constructor(module) {

    this._instance = module;
    this._instance.onerror = function (err) {};
    this._queryParameter = new URLSearchParams();
    this._requestUrl = '';
    this._csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content');
  }

  // FIXME: Repeated function call will only yield the result from latest call
  fetch(url, query) {
    return this
      .setQuery(query)
      .setRequestUrl(url)
      .sendQuery(this._instance)
      .catch((err) => { this._instance.terminate(); })
      .finally(() => this.clear());
  }

  setQuery(object) {
    if (!object) return this;
    for (const [key, value] of Object.entries(object)) {
      this._queryParameter.set(key, value);
    }
    return this;
  }
  
  setRequestUrl(url) {
    this._requestUrl = encodeURI(`${window.location.origin}/api/${url}?${this._queryParameter}`);
    return this;
  }

  sendQuery(instance) {
    const requestUrl = this._requestUrl;
    const csrfToken = this._csrfToken;
    return new Promise(function (resolve, reject) {
      instance.postMessage({
        'URL': requestUrl,
        'CSRF-Token': csrfToken,
      });
      instance.onmessage = function (message) {
        const result = message.data;
        if (!result || result instanceof Error) {
          reject(result);
          return;
        }
        resolve(result.rowCount ? result.rows : result);
      };
    });
  }

  clear() {
    for(let [key] of this._queryParameter.entries()) {
      this._queryParameter.delete(key);
    }
  }
}
