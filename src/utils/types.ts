import { Tabs } from 'webextension-polyfill-ts';

export interface BrowserMessage {
  msg: string;
  readonly data: {
    query: string;
    options: SearchOptions;
    tabs?: Tabs.Tab[];
  };
}

export interface SearchOptions {
  readonly isSearchHostnameChecked: boolean;
  readonly isSearchTitleChecked: boolean;
}
