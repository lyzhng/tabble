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

async function handleActivated(activeInfo) {
  const tab = (await browser.tabs.query({ active: true }))[0];
  console.log('[DEBUG] Activated Tab URL', tab.url);
  if (tab.url === TABBLE_EXT_URL) {
    console.log('[DEBUG] Tabble Activated');
    await browser.tabs.reload(tab.id);
  }
}

browser.tabs.onActivated.addListener(handleActivated);
