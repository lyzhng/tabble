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
  [windowId: number]: Array<ITab>;
}

interface IRequest {
  msg: string;
  query?: string;
  data: IData;
}

interface IData {
  tab: ITab;
  tabs: Array<ITab>;
  tabId: number;
  windowId: number;
  fromIndex: number;
  toIndex: number;
  newWindowId: number;
  newPosition: number;
  oldWindowId: number;
  oldPosition: number;
}

interface IUrl {
  [url: string]: string;
}

interface IMessage {
  [msg: string]: string;
}

interface ICommand {
  [cmd: string]: string;
}

export { ITab, IData, IWindowToTab, IRequest, IUrl, IMessage, ICommand };
