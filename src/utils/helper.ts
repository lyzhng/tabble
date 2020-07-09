import { TAB_PROPERTIES, Url } from './constants';
import { ITab } from './types';

function filterList(tabList: Array<ITab>): Array<ITab> {
  const filteredList: Array<ITab> = [];
  for (const tab of tabList) {
    const filteredTab: ITab = {} as ITab;
    for (const prop of TAB_PROPERTIES) {
      filteredTab[prop] = tab[prop];
    }
    filteredList.push(filteredTab);
  }
  return filteredList;
}

async function listTabs(): Promise<Array<ITab>> {
  const tabList: Array<ITab> = await browser.tabs.query({});
  return filterList(tabList);
}

async function checkTabble(): Promise<ITab | null> {
  const tabs: Array<ITab> = await listTabs();
  for (const t of tabs) {
    if (t.url === Url.TABBLE_EXT_URL) {
      return t;
    }
  }
  return null;
}

async function openTabble(): Promise<void> {
  const tabble = await checkTabble();
  if (tabble) {
    await browser.tabs.remove(tabble.id);
  }
  await browser.tabs.create({ url: Url.TABBLE_REL_URL });
}

export { filterList, listTabs, openTabble, checkTabble };
