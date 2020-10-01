import { browser } from 'webextension-polyfill-ts';

const TAB_PROPERTIES: string[] = ['active', 'favIconUrl', 'index', 'pinned', 'title', 'url', 'windowId', 'id'];

const TABBLE_REL_URL: string = '../dist/index.html';
const TABBLE_EXT_URL: string = browser.runtime.getURL(TABBLE_REL_URL);

interface Url {
  [key: string]: string;
}

const Url: Url = {
  TABBLE_REL_URL,
  TABBLE_EXT_URL,
};

interface Message {
  [key: string]: string;
}

const Message: Message = {
  GET_TABS: 'get_tabs',
  SEND_TABS: 'send_tabs',
  CREATE: 'create',
  MOVE: 'move',
  UPDATE: 'update',
  REMOVE: 'remove',
  ATTACH: 'attach',
  DETACH: 'detach',
};

interface Command {
  [key: string]: string;
}

const Command: Command = {
  OPEN: 'open',
};

export { TAB_PROPERTIES, Url, Message, Command };
