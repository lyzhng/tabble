const DESIRED_TAB_PROPERTIES = ['active', 'favIconUrl', 'index', 'pinned', 'title', 'url', 'windowId', 'id'];

function currentWindowTabs() {
  return browser.tabs.query({});
}

async function listTabs() {
  const tabList = await currentWindowTabs();
  const filteredList = [];
  for (const tab of tabList) {
    const filteredTab = {};
    for (const prop of DESIRED_TAB_PROPERTIES) {
      filteredTab[prop] = tab[prop];
    }
    filteredList.push(filteredTab);
  }
  return filteredList;
}

function onCreated(tab) {
  console.log(`Created a new tab: ${tab.id}`);
}

function onError(err) {
  console.error(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener(() => {
  const tabs = listTabs();
  browser.runtime.sendMessage({
    msg: 'Donezo'
  });
  var creating = browser.tabs.create({
    url: 'tabs.html'
  });
  creating.then(onCreated, onError);
});
