import { browser } from 'webextension-polyfill-ts';
import { IUrl, IMessage, ICommand } from './types';

const TAB_PROPERTIES: Array<string> = ['active', 'favIconUrl', 'index', 'pinned', 'title', 'url', 'windowId', 'id'];

const TABBLE_REL_URL: string = '../dist/index.html';
const TABBLE_EXT_URL: string = browser.runtime.getURL(TABBLE_REL_URL);

const Url: IUrl = {
  TABBLE_REL_URL,
  TABBLE_EXT_URL,
};

const Message: IMessage = {
  GET_TABS: 'get_tabs',
  SEND_TABS: 'send_tabs',
  CREATE: 'create',
  MOVE: 'move',
  UPDATE: 'update',
  REMOVE: 'remove',
  ATTACH: 'attach',
  DETACH: 'detach',
};

const Command: ICommand = {
  OPEN: 'open',
};

export { TAB_PROPERTIES, Url, Message, Command };
