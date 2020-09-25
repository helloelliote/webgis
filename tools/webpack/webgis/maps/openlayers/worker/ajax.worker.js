let messageData;

self.onmessage = event => {
  messageData = event.data;
  onFetch();
};

function onFetch() {
  return fetch(messageData['URL'],
    {
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': messageData['CSRF-Token'],
      },
    })
    .then(resolveResponse)
    .then(resolveBodyByType)
    .then(resolveContentByType)
    .then(result => self.postMessage(result))
    .catch(err => self.postMessage(err))
    .finally(() => {
      messageData = null;
    });
}

function resolveResponse(response) {
  if (!response.ok) throw new Error(response.statusText);
  return response;
}

function resolveBodyByType(response) {
  switch (messageData['Mime-Type']) {
    case 'image/jpg':
      return response.blob();
    default:
      return response.json();
  }
}

function resolveContentByType(response) {
  switch (messageData['Mime-Type']) {
    case 'image/jpg':
      return createImageBlobUrl(response);
    default:
      return response;
  }

  function createImageBlobUrl(response) {
    for (let i = 0, len = response.length; i < len; i++) {
      if (response[i][messageData['column']] === null) {
        continue;
      }
      const buffer = response[i][messageData['column']].data;
      const uint8Array = new Uint8Array(buffer);
      const blob = new Blob([uint8Array], { type: messageData['Mime-Type'] });
      response[i][messageData['column']] = URL.createObjectURL(blob);
    }
    return response;
  }
}
