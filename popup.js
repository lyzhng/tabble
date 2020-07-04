console.log('popup.js is running!');

browser.runtime.onMessage.addListener((req, res, sendResponse) => {
    console.log('req', req);
    console.log('res', res);
});