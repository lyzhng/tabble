import { browser } from 'webextension-polyfill-ts';
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

async function listTabs(query: string = ''): Promise<Array<ITab>> {
  const standardizedQuery: string = query.toLowerCase();
  const allTabs: Array<ITab> = await browser.tabs.query({});
  if (query !== '') {
    const queriedTabs: Array<ITab> = allTabs.filter((t: ITab) => new URL(t.url).hostname.includes(standardizedQuery));
    return filterList(queriedTabs);
  }
  return filterList(allTabs);
}

async function checkTabble(): Promise<Array<ITab>> {
  const tabs: Array<ITab> = await listTabs();
  return tabs.filter((t) => t.url.startsWith(Url.TABBLE_EXT_URL));
}

async function openTabble(): Promise<void> {
  const tabble = await checkTabble();
  const ids: number[] = tabble.map((t) => t.id);
  await browser.tabs.remove(ids);
  await browser.tabs.create({ url: Url.TABBLE_REL_URL });
}

export { filterList, listTabs, openTabble, checkTabble };
