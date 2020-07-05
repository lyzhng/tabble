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

const TABBLE_REL_URL = 'index.html';
const TABBLE_EXT_URL = browser.runtime.getURL(TABBLE_REL_URL);

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

async function openTabble() {
  const tabs = await listTabs();
  for (const t of tabs) {
    if (t.url === TABBLE_EXT_URL) {
      await browser.tabs.remove(t.id);
    }
  }
  await browser.tabs.create({ url: TABBLE_REL_URL });
}

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === 'get_tabs') {
    return listTabs();
  }
});

browser.browserAction.onClicked.addListener(async () => {
  await openTabble();
});

browser.commands.onCommand.addListener(async (command) => {
  if (command === 'open') {
    await openTabble();
  }
});
