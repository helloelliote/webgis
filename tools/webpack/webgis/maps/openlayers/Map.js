const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Make a request using the Fetch API
fetch('/api/test', {
  credentials: 'same-origin', // <-- includes cookies in the request
  headers: {
    'CSRF-Token': token, // <-- is the csrf token as a header
  },
  method: 'POST',
  body: {
    favoriteColor: 'blue',
  },
}).then(function (response) {
  return response.json();
}).then(function (result) {
  console.log(result);
});
