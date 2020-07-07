import { TAB_PROPERTIES, TABBLE_REL_URL, TABBLE_EXT_URL } from './constants.js';

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

async function checkTabble() {
  const tabs = await listTabs();
  for (const t of tabs) {
    if (t.url === TABBLE_EXT_URL) {
      return t;
    }
  }
  return null;
}

async function openTabble() {
  const tabble = await checkTabble();
  if (tabble) {
    await browser.tabs.remove(tabble.id);
  }
  await browser.tabs.create({ url: TABBLE_REL_URL });
}

export { filterList, listTabs, openTabble, checkTabble };
