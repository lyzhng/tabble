const TAB_PROPERTIES = [
  'active',
  'favIconUrl',
  'index',
  'pinned',
  'title',
  'url',
  'windowId',
  'id',
];
const TABBY_URL = 'index.html';

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === 'get_tabs') {
    return Promise.resolve(listTabs());
  }
});

function filterList(tabList) {
  const filteredList = [];
  for (const tab of tabList) {
    const filteredTab = {};
    for (const prop of TAB_PROPERTIES) {
      filteredTab[prop] = tab[prop];
    }
    filteredList.push(filteredTab);
  }
  return filteredList;
}

async function listTabs() {
  const tabList = await browser.tabs.query({});
  return filterList(tabList);
}

function onError(err) {
  console.error(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener(async () => {
  const tabs = await listTabs();
  await browser.tabs.create({ url: TABBY_URL });
});
