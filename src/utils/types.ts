interface ITab {
    id: number;
    index: number;
    windowId: number;
    active: boolean;
    favIconUrl: string;
    title: string;
    url: string;
}

interface IWindowToTab {
    [windowId: number]: Array<Tab>;
}

interface IRequest {
    msg: string;
    data: {
        tab: ITab;
        tabs: ITab[];
        tabId: number;
        windowId: number;
        fromIndex: number;
        toIndex: number;
        newWindowId: number;
        newPosition: number;
        oldWindowId: number;
        oldPosition: number;
    }
}

export { ITab, IWindowToTab, IRequest };
