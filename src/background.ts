import { browser, Tabs } from 'webextension-polyfill-ts';

import { listTabs, openTabble } from './utils/helper';
import { Message, Command } from './utils/constants';
import { BrowserMessage } from './utils/types';

async function handleMessage(req: BrowserMessage) {
  const {
    msg,
    data: { query, options, tabs },
  } = req;
  if (msg === Message.GET_TABS) {
    const _tabs: Partial<Tabs.Tab>[] = await listTabs(query, options);
    return {
      msg: Message.SEND_TABS,
      data: {
        tabs: _tabs,
      },
    };
  }
  if (msg === Message.HANDLE_REMOVED) {
    const _tabs: Partial<Tabs.Tab>[] = await listTabs(query, options, tabs);
    return {
      msg: Message.SEND_TABS,
      data: {
        tabs: _tabs,
      },
    };
  }
}

async function handleClicked(): Promise<void> {
  await openTabble();
}

async function handleCommand(command: string): Promise<void> {
  if (command === Command.OPEN) {
    await openTabble();
  }
}

async function handleCreated(tab: Tabs.Tab): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.CREATE,
  });
}

async function handleRemoved(tabId: number): Promise<void> {
  const tabs = (await browser.tabs.query({})).filter((t) => t.id !== tabId);
  await browser.runtime.sendMessage({
    msg: Message.REMOVE,
    data: {
      tabs,
    },
  });
}

const filter: Tabs.UpdateFilter = {
  urls: ['<all_urls>'],
  properties: ['title', 'favIconUrl'],
};

async function handleUpdated(): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.UPDATE,
  });
}

async function handleMoved(): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.MOVE,
  });
}

async function handleAttached(): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.ATTACH,
  });
}

async function handleDetached(): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.DETACH,
  });
}

browser.runtime.onMessage.addListener(handleMessage);
browser.browserAction.onClicked.addListener(handleClicked);
browser.commands.onCommand.addListener(handleCommand);
browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.tabs.onUpdated.addListener(handleUpdated, filter);
browser.tabs.onMoved.addListener(handleMoved);
browser.tabs.onAttached.addListener(handleAttached);
browser.tabs.onDetached.addListener(handleDetached);
