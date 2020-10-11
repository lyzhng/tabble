import { browser } from 'webextension-polyfill-ts';

const TAB_PROPERTIES: string[] = ['active', 'favIconUrl', 'index', 'pinned', 'title', 'url', 'windowId', 'id'];

const TABBLE_REL_URL: string = '../dist/index.html';
const TABBLE_EXT_URL: string = browser.runtime.getURL(TABBLE_REL_URL);

interface Url {
  TABBLE_REL_URL: string;
  TABBLE_EXT_URL: string;
}

const Url: Url = {
  TABBLE_REL_URL,
  TABBLE_EXT_URL,
};

enum Message {
  GET_TABS = 'GET_TABS',
  SEND_TABS = 'SEND_TABS',
  CREATE = 'CREATE',
  MOVE = 'MOVE',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  ATTACH = 'ATTACH',
  DETACH = 'DETACH',
  HANDLE_REMOVED = 'HANDLE_REMOVED',
}

enum Command {
  OPEN = 'OPEN',
}

export { TAB_PROPERTIES, Url, Message, Command };
