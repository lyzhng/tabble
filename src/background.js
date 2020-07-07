import { listTabs, openTabble, checkTabble } from './utils/helper.js';
import { GET_TABS_MSG, SEND_TABS_MSG, OPEN_CMD, TABBLE_EXT_URL } from './utils/constants.js';

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

