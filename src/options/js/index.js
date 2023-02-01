const configForm = document.querySelector('#config');
const removeSandboxInput = document.querySelector('#removeSandbox');
const hintField = document.querySelector('.hint-field');
const hintText = document.querySelector('.hint-field .hint');
let needSave = false;

function notify({ type = '', message = '' }) {
  if (hintField.classList.length === 1) {
    hintText.textContent = message;
    if (type === 'success') {
      hintText.classList.add('hint_success');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_success');
      }, 1e3);
    } else {
      hintText.classList.add('hint_error');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_error');
      }, 1e3);
    }
  }
}

configForm.addEventListener('change', function () {
  needSave = true;
});

configForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // save options
  chrome.storage.local.set(
    {
      config: {
        removeSandbox: removeSandboxInput.checked,
      },
    },
    function () {
      notify({
        type: 'success',
        message: 'Saved',
      });
      needSave = false;
    }
  );
});

document.querySelector('#get-advice').addEventListener('click', function () {
  needSave = true;
  removeSandboxInput.checked = true;
});

window.addEventListener('beforeunload', function (event) {
  if (needSave) {
    event.preventDefault();
    event.returnValue = '';
  }
});

// start
chrome.storage.local.get('config', function (res) {
  if ('config' in res) {
    removeSandboxInput.checked = res.config.removeSandbox;
  }
});
