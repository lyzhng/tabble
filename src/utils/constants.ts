import { browser } from 'webextension-polyfill-ts';

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

Object.freeze(Url);

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
  TOGGLE_MUTE = 'TOGGLE_MUTE',
  TOGGLE_PIN = 'TOGGLE_PIN',
}

enum Command {
  OPEN = 'OPEN',
}

export { Url, Message, Command };
