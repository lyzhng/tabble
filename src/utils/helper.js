import { TAB_PROPERTIES, TABBLE_REL_URL, TABBLE_EXT_URL } from './constants';

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

export { filterList, listTabs, openTabble };
