function getDoctypeHTML(doctype) {
  if (doctype) {
    let output = '<!DOCTYPE';

    if (doctype.name) {
      output += ' ' + doctype.name;
    }
    if (doctype.publicId) {
      output += ' PUBLIC "' + doctype.publicId + '"';
    }
    if (doctype.systemId) {
      output += ' "' + doctype.systemId + '"';
    }
    output += '>';

    return output;
  } else {
    return '';
  }
}

window.addEventListener('load', function () {
  chrome.storage.local.get('config', function (res) {
    if ('config' in res) {
      if (res.config.removeSandbox) {
        const lists = document.querySelectorAll('iframe');
        lists.forEach(function (iframe) {
          if (iframe.hasAttribute('sandbox')) {
            iframe.removeAttribute('sandbox');
            iframe.src += '';
          }
        });
      }
    }
  });
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === 'view-source') {
    const newtab = open();
    if (newtab) {
      // viewport
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';

      // css
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = chrome.runtime.getURL('newtab/css/index.css');

      // url
      const urlInput = document.createElement('input');
      urlInput.type = 'url';
      urlInput.value = location.href;
      urlInput.readOnly = true;

      // html
      const htmlInput = document.createElement('textarea');
      if (document.doctype) {
        htmlInput.value = [
          getDoctypeHTML(document.doctype),
          document.documentElement.outerHTML,
        ].join('\n');
      } else {
        htmlInput.value = [document.documentElement.outerHTML].join('\n');
      }
      htmlInput.readOnly = true;

      // inject
      const fragment = document.createDocumentFragment();
      fragment.appendChild(viewport);
      fragment.appendChild(cssLink);
      fragment.appendChild(urlInput);
      fragment.appendChild(htmlInput);
      newtab.document.body.appendChild(fragment);
    }
  }
});
