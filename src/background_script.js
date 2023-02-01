function callback(tab) {
  chrome.tabs.sendMessage(tab.id, {
    action: 'view-source',
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  callback(tab);
});

chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: 'view-source',
    title: 'View Source',
  });
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});
