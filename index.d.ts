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
export declare class IPage<D = any> implements wx.IPage {
    [other: string]: any;
    readonly options: any;
    readonly route: string;
    readonly data: D & InitalData;
    /**
     * @description `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     * @notice 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致
     * @notice 仅支持设置可 JSON 化的数据。
     * @notice 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * @notice 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     * @description 这次要改变的数据
     * @param data 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
     * @param data 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
     * @param callback setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0`
     */
    readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wx.SelectorQuery;
    readonly getRelationNodes: () => wx.NodesRef;
    readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Ipage'data field.
 * @description it will overwrite global data if possible
 */
export declare function page(inital?: InitalData): (target: new () => IPage<any>) => void;
export declare class Widget<D = any> implements wx.IComponent {
    [other: string]: any;
    readonly data: D & InitalData;
    /**
     * @description `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     * @notice 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致
     * @notice 仅支持设置可 JSON 化的数据。
     * @notice 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * @notice 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     * @description 这次要改变的数据
     * @param data 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
     * @param data 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
     * @param callback setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0`
     */
    readonly setData: <K extends keyof D>(data: (Pick<D, K> | D), callback?: () => void) => void;
    readonly triggerEvent: (name: string, detail?: any) => void;
    readonly selectComponent: (selector: string) => any;
    readonly selectAllComponents: () => any[];
    readonly createSelectorQuery: () => wx.SelectorQuery;
    readonly getRelationNodes: () => wx.NodesRef;
    readonly createIntersectionObserver: (options?: wx.IntersectionOptions) => wx.IntersectionObserver;
}
/**
 * @default undefined
 * @description inject inital data to the Commponent data field.
 */
export declare function widget(inital?: InitalData): (target: new () => Widget<any>) => void;
/**
 * @description the meta constructor of netowrk and storage
 */
export interface IMetaClass<T> {
    new (json?: any): T;
}
export declare class Network {
    protected readonly headers: any;
    protected readonly method: Network.Method;
    /**
     * @description resove relative uri to full url
     * @param path the relative uri
     */
    protected url(path: string): string;
    /**
     * @description you must provid an resover and return you business object
     * @param resp the http response object
     */
    protected resolve(resp: wx.HttpResponse): any;
    readonly upload: (file: Network.Upload, options?: Network.Options) => Promise<any>;
    readonly anyreq: <T>(req: Network.Request<T>) => Promise<T>;
    readonly objreq: <T>(req: Network.Request<T>) => Promise<T>;
    readonly aryreq: <T>(req: Network.Request<T>) => Promise<T[]>;
    readonly anytask: <T = any>(path: string, data?: any, options?: Network.Options) => Promise<T>;
    readonly objtask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Promise<T>;
    readonly arytask: <T>(c: IMetaClass<T>, path: string, data?: any, options?: Network.Options) => Promise<T[]>;
}
export declare namespace Network {
    type Method = 'POST' | 'GET';
    /**
     * @description the upload file struct
     * @param path the relative request path
     * @param name the filename
     * @param file the file local path  @example the result of wx.chooseImage
     */
    interface Upload {
        readonly path: string;
        readonly name: string;
        readonly file: string;
    }
    /**
     * @description the addtion network params
     * @param loading show loading modal or not or custome loading message. @default false
     * if true the default message is '加载中' . You can provide your custom message.
     * @param method  the http method to overwrite global http method config
     * the method will be ignore when upload file.
     * @param timestamp if true .the timestamp in http header will be return to result @default false
     */
    interface Options {
        readonly loading?: boolean | string;
        readonly method?: Method;
        readonly timestamp?: boolean;
    }
    /**
     * @description the network request interface use to packge request params
     * @param path the request relattive path
     * @param meta the respone data type descrpiton @notice it must be IMetaClass<T> in objreq() and aryreq()
     * @param data the request data
     * @param options the request options @see Options
     */
    interface Request<T = any> {
        readonly path: string;
        readonly meta: IMetaClass<T> | T;
        readonly data?: any;
        readonly options?: Options;
    }
}
export declare class Socket {
    private task;
    private _status;
    private _retrying;
    private readonly buildurl;
    retryable: boolean;
    readonly retry: Socket.Retry;
    onopen: (evt: any, isRetry: boolean) => void;
    onclose: (evt: wx.SocketClose) => void;
    onerror: (evt: wx.SocketError) => void;
    onfailed: (evt: wx.SocketClose) => void;
    onmessage: (evt: wx.SocketMessage) => void;
    constructor(builder: () => string);
    private onRetryCallback;
    private onRetryFailed;
    private onOpenCallback;
    private onCloseCallback;
    private onErrorCallback;
    private onMessageCallback;
    readonly open: () => void;
    readonly close: (code?: number, reason?: string) => void;
    readonly send: (data: string | ArrayBuffer) => void;
    readonly status: Socket.Status;
    readonly isRetrying: boolean;
}
export declare namespace Socket {
    type Status = 'closed' | 'closing' | 'opened' | 'opening';
    type Events = keyof Observers;
    interface Observer {
        readonly target: any;
        readonly callback: Function;
    }
    class Observers {
        readonly open: Observer[];
        readonly error: Observer[];
        readonly close: Observer[];
        readonly failed: Observer[];
        readonly message: Observer[];
    }
    /**
     * @description A retry machine for web socket
     * @description You can use it in any place where need retry machine
     */
    class Retry {
        /**
         * @description base attempt delay time @default 100 milliscond
         * @description the real delay time use a exponential random algorithm
         */
        delay: number;
        /**
         * @description the max retry times when retrying @default 5
         */
        times: number;
        private count;
        private readonly onAttempt;
        private readonly onFailed;
        constructor(attempt: (evt: wx.SocketClose) => void, failed: (evt: wx.SocketClose) => void);
        private random;
        /**
         * @description reset retry times counter
         */
        readonly reset: () => void;
        /**
         * @description use this method to trigger onAttempt action or onFailed action
         */
        readonly attempt: (evt: wx.SocketClose) => void;
    }
    class Ping {
        private socket;
        private timer;
        private timeout;
        private readonly allow;
        interval: number;
        constructor(socket: Socket, allow?: boolean);
        private readonly send;
        readonly receive: (msg: any) => void;
        readonly start: () => void;
        readonly stop: () => void;
    }
    /**
     * @description socket client wrapped on Socket
     * @description you must inherit this class to implements your logic
     * @implements client PING heartbeat mechanis
     */
    abstract class Client {
        /**
         * @description the ping mechanis
         * @ping  use socket.send("{\"type\":\"PING\"}")
         * @pong  receive message = "{\"type\":\"PONG\"}"
         */
        protected readonly ping: Ping;
        protected readonly socket: Socket;
        /**
         * @notice all the observers will not be trigger
         * @notice you must trigger it yourself at overwrite point
         */
        protected readonly observers: Observers;
        constructor();
        /**
         * @override print debug info or not @default true
         */
        protected readonly isDebug: boolean;
        /**
         * @description Tell me your login status @default false
         * @description If false the start method will not work
         */
        protected readonly isLogin: boolean;
        /**
         * @description overwrite point set allow ping or not
         */
        protected readonly allowPing: boolean;
        /**
         * @override point
         * @description overwrite this method to provide url for web socket
         */
        protected buildurl(): string;
        /** call when some error occur @override point */
        protected onError(res: wx.SocketError): void;
        /** call when socket closed . @override point */
        protected onOpened(res: any, isRetry: boolean): void;
        /**
         * @override point
         * @description call when socket closed
         * @notice onFailed and onClosed only trigger one
         */
        protected onClosed(res: wx.SocketClose): void;
        /**
         * @override point
         * @description call when socket retry failed
         * @notice onFailed and onClosed only trigger one
         */
        protected onFailed(res: wx.SocketClose): void;
        /** call when get some message @override point */
        protected onMessage(msg: any): void;
        readonly status: Status;
        readonly isConnected: boolean;
        readonly on: (evt: "open" | "error" | "close" | "failed" | "message", target: any, callback: Function) => void;
        readonly off: (evt: "open" | "error" | "close" | "failed" | "message", target: any) => void;
        readonly stop: () => void;
        readonly start: () => void;
    }
}
export declare class SocketClient {
    private _url;
    private _isConnected;
    private _isConnecting;
    private observers;
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
    protected handle: (msg: any, isOffline: boolean) => void;
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
    protected setURL(url: string): void;
    /**
     * @default false
     * @description you mast tell me the login status
     */
    protected readonly isLogin: boolean;
    /**
     * @default true
     * @description print debug info or not
     */
    protected readonly isDebug: boolean;
    /**
     * @default impl is return res.code === 4001 || res.code === 4002,4001,4002 is the default auth fail code
     * @description If get true socket will not attempt again. At this time didLogout will be call!
     */
    protected isAuthFail(res: wx.SocketClose): boolean;
    /** call when some error occur */
    protected onError(res: wx.SocketError): void;
    /** call when socket closed .  */
    protected onOpened(res: any): void;
    /** call when socket closed */
    protected onClosed(res: wx.SocketClose): void;
    /** call when socket retry failed */
    protected onFailed(): void;
    /** call when get some message */
    protected onMessage(msg: any, isOffline: boolean): void;
    /** call when isAuthFail is true when close */
    protected onAuthFail(): void;
    readonly isConnected: boolean;
    readonly isConnecting: boolean;
    /**
     * @description start the socket monitor.
     * try to connect the socket server.
     * the heartbeat mechanism will be work
     */
    readonly start: () => void;
    /**
     * @description stop the socket monitor.
     * stop heartbeat mechanism
     */
    readonly stop: () => void;
    readonly on: (evt: "open" | "error" | "close" | "failed" | "message", target: any, callback: Function) => void;
    readonly off: (evt: "open" | "error" | "close" | "failed" | "message", target: any) => void;
}
export declare namespace pop {
    /**
     * @description alert user some message
     * @param content the message to be show
     * @param confirm  the confirm callback
     */
    const alert: (content: string, confirm?: () => void) => void;
    /**
     * @description the dialog that need user make a decision
     * @param content the message to be show
     * @param confirm  the confirm callback
     * @param cancel the cancel callback
     */
    const dialog: (content: string, confirm?: () => void, cancel?: () => void) => void;
    /**
     * @description remind some successful msg to user. It will be auto dimiss affter 1s
     * @param ok the ok message
     * @param dismiss the callback of affter auto dismiss
     */
    const remind: (ok: string, dismiss?: () => void) => void;
    /**
     * @description to alert some err
     * @param err the err to be display
     */
    const error: (err: Error) => void;
    /**
     * @description show wating mask
     * @param title the loading title @default '加载中'
     */
    const waiting: (title?: string) => void;
    /**
     * @description hide the waiting mask .
     */
    const idling: () => void;
}
export declare namespace orm {
    /**
     * @description  A class decorate use to store class.
     * @param clsname the class name of your storage class
     * @param primary the primary key name of your storage class
     * @throws class already exist error.
     */
    const store: (clsname: string, primary: string) => <T>(target: IMetaClass<T>) => void;
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     */
    const field: <T>(cls: IMetaClass<T>) => (target: Object, field: string) => void;
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @store(...)
     * @throws did't mark error
     */
    const save: <T>(model: T) => void;
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const find: <T>(cls: IMetaClass<T>, id: string | number) => T;
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const all: <T>(cls: IMetaClass<T>) => T[];
    /**
     * @description get the count of all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const count: <T>(cls: IMetaClass<T>) => number;
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @throws did't mark error
     */
    const clear: <T>(cls: IMetaClass<T>) => void;
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @store(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const remove: <T>(cls: IMetaClass<T>, id: string | number) => void;
}
export {};