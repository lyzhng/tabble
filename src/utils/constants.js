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

const GET_TABS_MSG = 'get_tabs';
const SEND_TABS_MSG = 'send_tabs';
const OPEN_CMD = 'open';

export { TAB_PROPERTIES, TABBLE_REL_URL, TABBLE_EXT_URL, GET_TABS_MSG, SEND_TABS_MSG, OPEN_CMD };
