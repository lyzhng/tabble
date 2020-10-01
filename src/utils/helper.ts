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

async function listTabs(query: string = '', options?): Promise<Partial<Tabs.Tab>[]> {
  const allTabs: Tabs.Tab[] = await browser.tabs.query({});
  if (query !== '') {
    const standardizedQuery: string = query.toLowerCase();
    const { isSearchTitleChecked, isSearchHostnameChecked } = options;
    let queriedTabs: Set<Tabs.Tab> = new Set<Tabs.Tab>();
    if (isSearchTitleChecked) {
      const tabsWithQueryInTitle = allTabs.filter((t) => t.title?.toLowerCase().includes(standardizedQuery));
      tabsWithQueryInTitle.forEach((t) => queriedTabs.add(t));
    }
    if (isSearchHostnameChecked) {
      const tabsWithQueryInHostname = allTabs.filter((t) => t.url && new URL(t.url).hostname.includes(standardizedQuery));
      tabsWithQueryInHostname.forEach((t) => queriedTabs.add(t));
    }
    return filterList(Array.from(queriedTabs));
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
