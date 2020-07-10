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

async function checkTabble(): Promise<Array<ITab>> {
  const tabs: Array<ITab> = await listTabs();
  const tabble: Array<ITab> = [];
  for (const t of tabs) {
    if (t.url === Url.TABBLE_EXT_URL) {
      tabble.push(t);
    }
  }
  return tabble;
}

async function openTabble(): Promise<void> {
  const tabble = await checkTabble();
  const ids: Array<number> = tabble.map((t) => t.id);
  await browser.tabs.remove(ids);
  await browser.tabs.create({ url: Url.TABBLE_REL_URL });
}

export { filterList, listTabs, openTabble, checkTabble };
