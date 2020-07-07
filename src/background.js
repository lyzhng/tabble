import { listTabs, openTabble, checkTabble } from './utils/helper.js';
import { GET_TABS_MSG, SEND_TABS_MSG, OPEN_CMD, TABBLE_EXT_URL } from './utils/constants.js';

browser.runtime.onMessage.addListener(async (req, sender) => {
  if (req.msg === GET_TABS_MSG) {
    const tabs = await listTabs();
    return {
      msg: SEND_TABS_MSG,
      data: tabs,
    };
  }
});

browser.browserAction.onClicked.addListener(async () => {
  await openTabble();
});

browser.commands.onCommand.addListener(async (command) => {
  if (command === OPEN_CMD) {
    await openTabble();
  }
});

const filter = {
  urls: ['<all_urls>'],
  properties: ['title', 'favIconUrl'],
};

browser.tabs.onCreated.addListener(async (tab) => {
  await browser.runtime.sendMessage({
    msg: 'create',
    data: {
      tab,
    },
  });
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const { windowId } = removeInfo;
  await browser.runtime.sendMessage({
    msg: 'remove',
    data: {
      tabId,
      windowId,
    },
  });
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await browser.runtime.sendMessage({
    msg: 'update',
    data: {
      tabId,
      tab,
    },
  });
}, filter);

browser.tabs.onMoved.addListener(async (tabId, moveInfo) => {
  const { windowId, fromIndex, toIndex } = moveInfo;
  const tab = await browser.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: 'move',
    data: {
      tab,
      tabId,
      windowId,
      fromIndex,
      toIndex,
    },
  });
});

browser.tabs.onAttached.addListener(async (tabId, attachInfo) => {
  console.log('A tab has been attached!');
  const { newWindowId, newPosition } = moveInfo;
  const tab = await browser.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: 'attach',
    data: {
      tab,
      tabId,
      newWindowId,
      newPosition,
    },
  });
});

browser.tabs.onDetached.addListener(async (tabId, detachInfo) => {
  console.log('A tab has been detached!');
  const { oldWindowId, oldPosition } = detachInfo;
  const tab = await brower.tabs.get(tabId);
  await browser.runtime.sendMessage({
    msg: 'detach',
    data: {
      tab,
      oldWindowId,
      oldPosition,
    },
  });
});
