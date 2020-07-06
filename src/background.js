import { listTabs, openTabble } from './utils/helper.js';

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg === 'get_tabs') {
    return listTabs();
  }
});

browser.browserAction.onClicked.addListener(async () => {
  await openTabble();
});

browser.commands.onCommand.addListener(async (command) => {
  if (command === 'open') {
    await openTabble();
  }
});
