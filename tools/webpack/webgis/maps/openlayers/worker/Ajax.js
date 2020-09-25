export default class Ajax {

  constructor(module) {
    this._instance = module;
    this._instance.onerror = function (err) {
    };
    this._queryParameter = new URLSearchParams();
    this._mimeType = 'text/plain';
    this._requestUrl = '';
    this._csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content');
  }

  fetch(url, query, opt_type) {
    return this
      .setQuery(query)
      .setContentType(opt_type)
      .setRequestUrl(url)
      .sendQuery(this._instance)
      .catch((err) => {
        this._instance.terminate();
      })
      .finally(() => this.clear());
  }

  setQuery(object) {
    if (!object) return this;
    for (const [key, value] of Object.entries(object)) {
      this._queryParameter.set(key, value);
    }
    return this;
  }

  setContentType(type) {
    this._mimeType = type;
    return this;
  }

  setRequestUrl(url) {
    this._requestUrl = encodeURI(`${window.location.origin}/api/${url}?${this._queryParameter}`);
    return this;
  }

  sendQuery(instance) {
    const requestUrl = this._requestUrl;
    const csrfToken = this._csrfToken;
    const mimeType = this._mimeType;
    return new Promise(function (resolve, reject) {
      instance.postMessage({
        'URL': requestUrl,
        'CSRF-Token': csrfToken,
        'Mime-Type': mimeType,
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
    for (let [key] of this._queryParameter.entries()) {
      this._queryParameter.delete(key);
    }
  }
}
