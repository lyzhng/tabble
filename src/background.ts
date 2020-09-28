import { listTabs, openTabble } from './utils/helper';
import { Message, Command } from './utils/constants';
import { ITab, IRequest } from './utils/types';

async function handleMessage(req: IRequest): Promise<IRequest> {
  if (req.msg === Message.GET_TABS) {
    const tabs: Array<ITab> = await listTabs(req.query);
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

async function handleCreated(tab: ITab): Promise<void> {
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

const filter = {
  urls: ['<all_urls>'],
  properties: ['title', 'favIconUrl'],
};

async function handleUpdated(tabId, changeInfo, tab: ITab): Promise<void> {
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

async function handleAttached(tabId: number, attachInfo: { newWindowId: number; newPosition: number }): Promise<void> {
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

async function handleDetached(tabId: number, detachInfo: { oldWindowId: number; oldPosition: number }): Promise<void> {
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
