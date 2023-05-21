function start() {
  chrome.storage.local.get('config', function (res) {
    if ('config' in res) {
      // remove old context menus
      chrome.contextMenus.removeAll(function () {
        initContextMenus();
      });
    } else {
      // writing settings will invoke chrome.storage.onChanged
      chrome.storage.local.set({
        config: DEFAULT_SETTINGS,
      });
    }
  });
}

function initContextMenus() {
  chrome.contextMenus.create({
    id: 'view-source',
    title: 'View Source',
  });
}

function callback(tab) {
  chrome.tabs.sendMessage(tab.id, {
    action: 'view-source',
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  callback(tab);
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener(function () {
  // restart
  start();
});

// start
start();
