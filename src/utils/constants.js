const TAB_PROPERTIES = [
    'active',
    'favIconUrl',
    'index',
    'pinned',
    'title',
    'url',
    'windowId',
    'id',
];

const TABBLE_REL_URL = 'index.html';

const TABBLE_EXT_URL = browser.runtime.getURL(TABBLE_REL_URL);

export { TAB_PROPERTIES, TABBLE_REL_URL, TABBLE_EXT_URL };
