'use strict';

self.onmessage = event => {
  onFetch(event.data);
};

function onFetch(data) {
  return fetch(data['URL'], {
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': data['CSRF-Token'],
    },
  })
    .then(response => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(result => {
      self.postMessage(result);
    })
    .catch(err => {
      self.postMessage(err);
    })
    .finally(() => {});
}
