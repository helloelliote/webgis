'use strict';

let mimeType;

self.onmessage = event => {
  mimeType = event.data['Mime-Type'];
  onFetch(event.data);
};

function onFetch(data) {
  return fetch(data['URL'], 
    {
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': data['CSRF-Token'],
      },
    })
    .then(resolveResponse)
    .then(resolveBodyByType)
    .then(resolveContentByType)
    .then(result => self.postMessage(result))
    .catch(err => self.postMessage(err))
    .finally(() => {});
}

function resolveResponse(response) {
  if (!response.ok) throw new Error(response.statusText);
  return response;
}

function resolveBodyByType(response) {
  switch (mimeType) {
    case 'image/jpg':
      return response.blob();
    default:
      return response.json();
  }
}

function resolveContentByType(response) {
  switch (mimeType) {
    case 'image/jpg': // TODO: Image -> Blob process
      // for (let i = 0, len = response.length; i < len; i++) {
      //   if (response[i][payload.table.image] === null) {
      //     continue;
      //   }
      //   const buffer = response[i][payload.table.image].data;
      //   const uint8Array = new Uint8Array(buffer);
      //   const blob = new Blob([uint8Array], { type: mimeType });
      //   response[i][payload.table.image] = URL.createObjectURL(blob);
      // }
      return response;
    default:
      return response;
  }
}
