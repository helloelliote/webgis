module.exports = function (api) {
  api.cache.forever();
  console.log('HOLA!');
  return {};
};
