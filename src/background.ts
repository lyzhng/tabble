import { browser, Tabs } from 'webextension-polyfill-ts';

import { listTabs, openTabble } from './utils/helper';
import { Message, Command } from './utils/constants';

async function handleMessage(req) {
  if (req.msg === Message.GET_TABS) {
    const tabs: Partial<Tabs.Tab>[] = await listTabs(req.query, req.options);
    return {
      msg: Message.SEND_TABS,
      data: {
        tabs,
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
    data: {
      tab,
    },
  });
}

async function handleRemoved(tabId: number, removeInfo: { windowId: number }): Promise<void> {
  const { windowId } = removeInfo;
  await browser.runtime.sendMessage({
    msg: Message.REMOVE,
    data: {
      tabId,
      windowId,
    },
  });
}

const filter: Tabs.UpdateFilter = {
  urls: ['<all_urls>'],
  properties: ['title', 'favIconUrl'],
};

async function handleUpdated(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab): Promise<void> {
  await browser.runtime.sendMessage({
    msg: Message.UPDATE,
    data: {
      tab,
    },
  });
}

async function handleMoved(
  tabId: number,
  moveInfo: { windowId: number; fromIndex: number; toIndex: number }
): Promise<void> {
  const { windowId, fromIndex, toIndex }: Tabs.OnMovedMoveInfoType = moveInfo;
  const tab = await browser.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: Message.MOVE,
    data: {
      tab,
      windowId,
      fromIndex,
      toIndex,
    },
  });
}

async function handleAttached(tabId: number, attachInfo: { newWindowId: number; newPosition: number }): Promise<void> {
  const { newWindowId, newPosition }: Tabs.OnAttachedAttachInfoType = attachInfo;
  const tab = await browser.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: Message.ATTACH,
    data: {
      tab,
      newWindowId,
      newPosition,
    },
  });
}

async function handleDetached(tabId: number, detachInfo: { oldWindowId: number; oldPosition: number }): Promise<void> {
  const { oldWindowId, oldPosition }: Tabs.OnDetachedDetachInfoType = detachInfo;
  const tab = await browser.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: Message.DETACH,
    data: {
      tab,
      oldWindowId,
      oldPosition,
    },
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
