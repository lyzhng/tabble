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

const TABBLE_REL_URL = '../dist/index.html';
const TABBLE_EXT_URL = browser.runtime.getURL(TABBLE_REL_URL);

const Url = {
    TABBLE_REL_URL,
    TABBLE_EXT_URL,
};

const Message = {
    GET_TABS: 'get_tabs',
    SEND_TABS: 'send_tabs',
    CREATE: 'create',
    MOVE: 'move',
    UPDATE: 'update',
    REMOVE: 'remove',
    ATTACH: 'attach',
    DETACH: 'detach',
};

const Command = {
    OPEN: 'open',
};

export { TAB_PROPERTIES, Url, Message, Command };
