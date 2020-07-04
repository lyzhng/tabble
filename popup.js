console.log('popup.js is running!');

browser.tabs.getCurrent(async (tab) => {
  const tabList = await browser.runtime.sendMessage('get_tabs');
  console.log(tabList);
});

// when user goes to extension URL (not just when popup)
