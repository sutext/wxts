interface InitalData {
    [key: string]: any;
}
export declare class IApp {
    [other: string]: any;
}
export interface IAppConstructor {
    new (): IApp;
}
/**
 * @description global data 会被注入到每个页面中去，如果页面提供了相同的变量 将会覆盖 global 里面的值
 */
export declare function app(global?: InitalData): (target: IAppConstructor) => void;
export declare class IPage<D = any> {
    [other: string]: any;
    readonly options: any;
    readonly route: string;
    readonly data: D & InitalData;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    triggerEvent: (name: string, detail?: any) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    createSelectorQuery: () => wts.SelectorQuery;
    getRelationNodes: () => wts.NodesRef;
    createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver;
}
export interface IPageConstructor {
    new (): IPage;
}
export declare function page(inital?: InitalData): (target: IPageConstructor) => void;
export declare class Widget<D = any> {
    [other: string]: any;
    readonly data: D & InitalData;
    setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    triggerEvent: (name: string, detail?: any) => void;
    selectComponent: (selector: string) => Widget;
    selectAllComponents: () => Widget[];
    createSelectorQuery: () => wts.SelectorQuery;
    getRelationNodes: () => wts.NodesRef;
    createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver;
}
export interface WidgetConstructor {
    new (): Widget;
}
export declare function widget(inital?: InitalData): (target: WidgetConstructor) => void;
export interface ImageFile {
    path: string;
    name: string;
    file: string;
}
export declare class Network {
    /**
     * @default POST
     * @description provide request methd
     */
    protected readonly method: wts.HttpMethod;
    /**
     * @default {}
     * @description provide custom http headers
     */
    protected readonly header: any;
    /**
     * @description resove relative uri to full url
     * @param path the relative uri
     */
    protected url(path: string): string;
    /**
     * @description you must provid an resover and return you business object
     * @param resp the http response object
     */
    protected resolve(resp: wts.HttpResponse): any;
    upload(file: ImageFile, loading?: boolean): Promise<string>;
    anytask(path: string, data?: any, loading?: boolean): Promise<any>;
    objtask<T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T>;
    arytask<T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean): Promise<T[]>;
}
declare class Popver {
    alert(content: string, confirm?: () => void): void;
    dialog(content: string, confirm?: () => void, cancel?: () => void): void;
    remind(ok: string, dismiss?: () => void): void;
    error(err: Error): void;
    waiting(title?: string): void;
    idling(): void;
}
export declare const pop: Popver;
export interface Listener {
    onMessage(json: any, isOffline: boolean): any;
}
export declare class Socket {
    private _isConnected;
    private _isConnecting;
    private listeners;
    private timer;
    private pingTimeout;
    private task;
    private attemptTimes;
    private addObserve;
    private affterClose;
    private close;
    private attempt;
    private reattemp;
    private timerFunc;
    private connect;
    private log;
    private handle;
    constructor();
    /**
     * @default 10
     * @description the max attempt times
     */
    protected maxAttemptTimes: number;
    /**
     * @default 30
     * @description the heartbeat interal
     */
    protected heartbeatInterval: number;
    /**
     * subclass must impl this method to resolve url
     * you must provide connect url
     */
    protected readonly url: string;
    /**
     * you mast tell me you login status
     * @default false
     */
    protected readonly isLogin: boolean;
    /**
     * print debug info or not
     */
    protected readonly isDebug: boolean;
    /**
     * @default impl is return res.code === 4001 || res.code === 4002,4001,4002 is the default auth fail code
     * @description if true socket will no more attemp adn didLogout will be call!
     */
    protected isAuthClose(res: wts.SocketCloser): boolean;
    /** the staus observe . It will be call when socket never attemped */
    protected didConnected(): void;
    /** call when socket opend */
    protected disConnected(): void;
    /**
     * @see isAuthClose
     * @param res logout res
     */
    protected didLogout(res: wts.SocketCloser): void;
    /** call when some error opend */
    protected didError(error: Error): void;
    readonly isConnected: boolean;
    readonly isConnecting: boolean;
    start: () => void;
    stop: () => void;
    addListener: (listener: Listener) => void;
    removeListener: (listener: Listener) => void;
}
export interface StorageAble {
    id: string | number;
    isEmpty: boolean;
    className: string;
}
declare class Storage {
    save<T extends StorageAble>(model: T): void;
    find<T extends StorageAble>(c: new (json?: any) => T, id: string | number): T | undefined;
    all<T extends StorageAble>(c: new (json?: any) => T): T[];
}
export declare const storage: Storage;
export {};
