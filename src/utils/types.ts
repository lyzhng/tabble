import { Tabs } from 'webextension-polyfill-ts';

interface BrowserMessage {
  msg: string;
  readonly data: {
    query: string;
    options: SearchOptions;
    tabs?: Tabs.Tab[];
  };
}

interface SearchOptions {
  readonly isSearchHostnameChecked: boolean;
  readonly isSearchTitleChecked: boolean;
}

export { BrowserMessage, SearchOptions };
