function isDevModeEnabled(mode) {
  console.error(`isDevModeEnabled: ${mode}`);
  document.querySelector('.menu-dev').style.display = mode ? 'block' : 'none';
  if (mode) {
    runTest1();
  }
}

function runTest1() {
  const runDevEditButton = document.getElementById('btn-dev-edit');
  runDevEditButton.addEventListener('click', () => {

  });
}

export default {
  isDevModeEnabled,
};
