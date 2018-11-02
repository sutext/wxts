interface InitalData {
    [key: string]: any;
}
export declare class IApp {
    [other: string]: any;
}
/**
 * @default {}
 * @description global data will be inject to every Ipage.
 * @description if local Ipage provide the same variable it will overwrite
 */
export declare function app(global?: InitalData): (target: new () => IApp) => void;
export declare class IPage<D = any> {
    [other: string]: any;
    readonly options: any;
    readonly route: string;
    readonly data: D & InitalData;
    readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wts.SelectorQuery;
    readonly getRelationNodes: () => wts.NodesRef;
    readonly createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Ipage'data field.
 * @description it will overwrite global data if possible
 */
export declare function page(inital?: InitalData): (target: new () => IPage<any>) => void;
export declare class Widget<D = any> {
    [other: string]: any;
    readonly data: D & InitalData;
    readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wts.SelectorQuery;
    readonly getRelationNodes: () => wts.NodesRef;
    readonly createIntersectionObserver: (options?: wts.IntersectionOptions) => wts.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Commponent data field.
 */
export declare function widget(inital?: InitalData): (target: new () => Widget<any>) => void;
export interface ImageFile {
    readonly path: string;
    readonly name: string;
    readonly file: string;
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
    readonly upload: (file: ImageFile, loading?: boolean) => Promise<string>;
    readonly anytask: (path: string, data?: any, loading?: boolean) => Promise<any>;
    readonly objtask: <T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean) => Promise<T>;
    readonly arytask: <T>(c: new (json: any) => T, path: string, data?: any, loading?: boolean) => Promise<T[]>;
}
declare class Popver {
    readonly alert: (content: string, confirm?: () => void) => void;
    readonly dialog: (content: string, confirm?: () => void, cancel?: () => void) => void;
    readonly remind: (ok: string, dismiss?: () => void) => void;
    readonly error: (err: Error) => void;
    readonly waiting: (title?: string) => void;
    readonly idling: () => void;
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
     * @description If get true socket will not attempt again. At this time didLogout will be call!
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
    readonly start: () => void;
    readonly stop: () => void;
    readonly addListener: (listener: Listener) => void;
    readonly removeListener: (listener: Listener) => void;
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
