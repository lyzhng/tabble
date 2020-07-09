import { listTabs, openTabble, checkTabble } from './utils/helper.js';
import { Message, Command } from './utils/constants.js';

async function handleMessage(req) {
  if (req.msg === Message.GET_TABS) {
    const tabs = await listTabs();
    return {
      msg: Message.SEND_TABS,
      data: tabs,
    };
  }
}

async function handleClicked() {
  await openTabble();
}

async function handleCommand(command) {
  if (command === Command.OPEN) {
    await openTabble();
  }
}

async function handleCreated(tab) {
  await browser.runtime.sendMessage({
    msg: Message.CREATE,
    data: {
      tab,
    },
  });
}

async function handleRemoved(tabId, removeInfo) {
  const { windowId } = removeInfo;
  await browser.runtime.sendMessage({
    msg: Message.REMOVE,
    data: {
      tabId,
      windowId,
    },
  });
}

const filter = {
  urls: ['<all_urls>'],
  properties: ['title', 'favIconUrl'],
};

async function handleUpdated(tabId, changeInfo, tab) {
  await browser.runtime.sendMessage({
    msg: Message.UPDATE,
    data: {
      tab,
    },
  });
}

async function handleMoved(tabId, moveInfo) {
  const { windowId, fromIndex, toIndex } = moveInfo;
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

async function handleAttached(tabId, attachInfo) {
  const { newWindowId, newPosition } = attachInfo;
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

async function handleDetached(tabId, detachInfo) {
  const { oldWindowId, oldPosition } = detachInfo;
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
